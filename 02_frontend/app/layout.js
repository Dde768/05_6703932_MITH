import "./globals.css";

export const metadata = {
  title: "MITH Perfume Collection",
  description: "MITH perfume products from Thailand (Docker + Jenkins demo)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
