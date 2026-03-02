export default function Header() {
  return (
    <header>
      <div className="container nav">
        <div className="logo">
          <div className="logo-mark">
            <img src="/logo.png" alt="Spotlight Surge logo" />
          </div>
        </div>
        <nav className="nav-links">
          <a href="#books">Books</a>
          <a href="#authors">Authors</a>
          <a href="#events">Events</a>
          <a href="/auth">Community</a>
        </nav>
        <a className="btn btn-secondary" href="/auth">
          Join Now
        </a>
      </div>
    </header>
  );
}
