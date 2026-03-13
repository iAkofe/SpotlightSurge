import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoUsers = [
  {
    email: "author.demo@spotlightsurge.dev",
    name: "Author Demo",
    role: "AUTHOR",
    password: "AuthorDemo123!",
    bio: "Demo author account for testing dashboard and publishing flow.",
    website: "https://example.com/author-demo"
  },
  {
    email: "reader.demo@spotlightsurge.dev",
    name: "Reader Demo",
    role: "READER",
    password: "ReaderDemo123!",
    bio: "",
    website: ""
  }
];

async function main() {
  for (const user of demoUsers) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        bio: user.bio,
        website: user.website
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash,
        bio: user.bio,
        website: user.website
      }
    });

    console.log(`Upserted ${record.role} user: ${record.email}`);
  }
}

main()
  .catch((error) => {
    console.error("Failed to create demo users", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
