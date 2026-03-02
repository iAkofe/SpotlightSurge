import "./globals.css";

export const metadata = {
  title: "Spotlight Surge | Where Stories Come Alive",
  description: "Discover, celebrate, and promote the authors and books that move you."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
