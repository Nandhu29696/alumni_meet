import './globals.css';
import './screens.css';
import '../styles/app.scss';
import './enhancements.css';

export const metadata = {
  title: 'Alumni Meet',
  description: 'A connected alumni community for meaningful reunions.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
