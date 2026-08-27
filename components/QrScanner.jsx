'use client';

import { useEffect, useRef, useState } from 'react';

export default function QrScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let scanner;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      return scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 220 } }, (value) => { onScan(value); scanner.stop().catch(() => {}); }, () => {});
    }).catch(() => setError('Camera scanning is unavailable. Check browser camera permissions.'));
    return () => { if (scannerRef.current) scannerRef.current.stop().catch(() => {}); };
  }, [onScan]);
  return <div className="qr-scanner"><div id="qr-reader" /><p>{error || 'Point the camera at a registration QR code.'}</p></div>;
}
