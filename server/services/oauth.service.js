import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { issueSession } from "./session.service.js";

function oauthEnabled(provider) {
  if (provider === "google") {
    return Boolean(config.googleClientId && config.googleClientSecret && config.googleCallbackUrl);
  }

  if (provider === "facebook") {
    return Boolean(config.facebookAppId && config.facebookAppSecret && config.facebookCallbackUrl);
  }

  return false;
}

async function findOrCreateFromOAuth({ provider, providerUserId, email, name }) {
  let oauthAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerUserId: { provider, providerUserId }
    },
    include: { user: true }
  });

  if (oauthAccount) {
    return oauthAccount.user;
  }

  let user = null;
  if (email) {
    user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);
    user = await prisma.user.create({
      data: {
        name,
        email: (email || `${providerUserId}@${provider}.oauth.local`).toLowerCase(),
        passwordHash,
        role: "READER"
      }
    });
  }

  await prisma.oAuthAccount.create({
    data: {
      userId: user.id,
      provider,
      providerUserId
    }
  });

  return user;
}

export function configureOAuth() {
  if (oauthEnabled("google")) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.googleClientId,
          clientSecret: config.googleClientSecret,
          callbackURL: config.googleCallbackUrl
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName || "Google User";
            const user = await findOrCreateFromOAuth({
              provider: "GOOGLE",
              providerUserId: profile.id,
              email,
              name
            });
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  if (oauthEnabled("facebook")) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: config.facebookAppId,
          clientSecret: config.facebookAppSecret,
          callbackURL: config.facebookCallbackUrl,
          profileFields: ["id", "displayName", "emails"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName || "Facebook User";
            const user = await findOrCreateFromOAuth({
              provider: "FACEBOOK",
              providerUserId: profile.id,
              email,
              name
            });
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }
}

export function ensureOAuthEnabled(provider) {
  return oauthEnabled(provider);
}

export function oauthCallbackHandler(req, res, next) {
  return async (error, user) => {
    if (error || !user) {
      const message = encodeURIComponent("Social login failed.");
      res.redirect(`${config.clientOrigin}/auth?error=${message}`);
      return;
    }

    try {
      const accessToken = await issueSession(user, res);
      res.redirect(`${config.clientOrigin}/auth?accessToken=${encodeURIComponent(accessToken)}`);
    } catch (issueError) {
      next(issueError);
    }
  };
}
