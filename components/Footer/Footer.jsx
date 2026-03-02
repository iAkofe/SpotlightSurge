export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark">
                <img src="/logo.png" alt="Spotlight Surge logo" />
              </div>
            </div>
            <p>
              Empowering authors, celebrating stories, and building a community of
              passionate readers.
            </p>
            <a className="btn btn-primary" href="/auth">
              Join the Community
            </a>
          </div>
          <div className="footer-grid">
            <div>
              <h4>Explore</h4>
              <p>
                <a href="#">Home</a>
              </p>
              <p>
                <a href="#books">Books</a>
              </p>
              <p>
                <a href="#authors">Authors</a>
              </p>
              <p>
                <a href="#events">Events</a>
              </p>
            </div>
            <div>
              <h4>Programs</h4>
              <p>
                <a href="#">Author Residencies</a>
              </p>
              <p>
                <a href="#">Launch Support</a>
              </p>
              <p>
                <a href="#">Reader Circles</a>
              </p>
              <p>
                <a href="#">Editorial Reviews</a>
              </p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>
                <a href="mailto:hello@spotlightsurge.com">hello@spotlightsurge.com</a>
              </p>
              <p>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </p>
              <p>Mon-Fri 9AM-6PM</p>
              <p>
                <a href="#">Instagram</a> / <a href="#">YouTube</a>
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Spotlight Surge. All rights reserved.</p>
          <p>
            <a href="#">Privacy</a> | <a href="#">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
