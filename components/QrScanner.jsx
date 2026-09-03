'use client';

import { useEffect, useRef, useState } from 'react';

export default function QrScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [readingFile, setReadingFile] = useState(false);
  const [error, setError] = useState('');

  onScanRef.current = onScan;

  function handleScan(value) {
    onScanRef.current(value);
    scannerRef.current?.stop().catch(() => {});
  }

  async function scanImage(event) {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;
    setReadingFile(true);
    try {
      await scannerRef.current.stop().catch(() => {});
      const value = await scannerRef.current.scanFile(file, true);
      handleScan(value);
    } catch {
      setError('No QR code found in that image. Try a clearer image.');
    } finally {
      setReadingFile(false);
      event.target.value = '';
    }
  }

  useEffect(() => {
    let scanner;
    let cancelled = false;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (cancelled) return;
      scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      return scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (value) => handleScan(value),
        () => {}
      );
    }).catch(() => {
      if (!cancelled) setError('Camera scanning is unavailable. Check browser camera permissions.');
    });
    return () => {
      cancelled = true;
      const activeScanner = scannerRef.current;
      scannerRef.current = null;
      if (activeScanner) {
        activeScanner.stop().then(() => activeScanner.clear()).catch(() => {});
      }
    };
  }, []);
  return <div className="qr-scanner">
    <button type="button" className="qr-scanner-close" onClick={onClose} aria-label="Close camera scanner" title="Close camera scanner">×</button>
    <div id="qr-reader" />
    <p>{error || 'Allow camera access, then point the camera at a registration QR code.'}</p>
    <label className="qr-image-upload">{readingFile ? 'Reading image...' : 'Scan QR from image'}<input type="file" accept="image/*" onChange={scanImage} disabled={readingFile} /></label>
  </div>;
}
