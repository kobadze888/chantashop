'use client';

import { useEffect } from 'react';

/**
 * Tawk.to live chat loader.
 * Free, unlimited, with iOS/Android agent apps for replying on the go.
 *
 * Enable by setting in the server .env:
 *   NEXT_PUBLIC_TAWK_PROPERTY_ID=xxxxxxxxxxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_TAWK_WIDGET_ID=1xxxxxxxx   (defaults to "default")
 * (found in Tawk.to → Administration → Channels → Chat Widget)
 *
 * Renders nothing until the property id is provided.
 */
const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || 'default';

export default function LiveChat() {
  useEffect(() => {
    if (!PROPERTY_ID) return;
    if (document.getElementById('tawk-to-script')) return;

    const s = document.createElement('script');
    s.id = 'tawk-to-script';
    s.async = true;
    s.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.body.appendChild(s);
  }, []);

  return null;
}
