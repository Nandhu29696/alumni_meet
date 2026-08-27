import './globals.css';
import './screens.css';
import '../styles/app.scss';
import './enhancements.css';
import Providers from './providers';

export const metadata = {
  title: 'Alumni Meet',
  description: 'A connected alumni community for meaningful reunions.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
