import './globals.css';

export const metadata = {
  title: 'Script Generator',
  description: 'Generate video scripts with Claude',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
