import './globals.css';
import './screens.css';
import '../styles/app.scss';
import './enhancements.css';
import './public-home.css';
import Providers from './providers';

export const metadata = {
  title: 'Alumni Meet',
  description: 'Reconnect with classmates, discover alumni events, and grow your school community with Alumni Meet.',
  keywords: ['alumni network', 'school alumni', 'college alumni', 'company alumni', 'community events', 'reunions'],
  metadataBase: new URL('https://alumnimeet.example'),
  icons: {
    icon: '/alumni-meet-mark.svg',
    shortcut: '/alumni-meet-mark.svg',
    apple: '/alumni-meet-mark.svg'
  },
  openGraph: {
    title: 'Alumni Meet | Keep the good people close',
    description: 'A shared home for the people and places that shaped us.',
    type: 'website',
    images: [{ url: '/alumni-meet-mark.svg', width: 128, height: 128, alt: 'Alumni Meet' }]
  },
  twitter: {
    card: 'summary',
    title: 'Alumni Meet | Keep the good people close',
    description: 'Reconnect, gather, and belong.',
    images: ['/alumni-meet-mark.svg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
