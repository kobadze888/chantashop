'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/* Major Georgian cities — delivery coverage. Tbilisi highlighted. */
const CITIES: Array<{ name: string; lat: number; lng: number; big?: boolean }> = [
  { name: 'თბილისი', lat: 41.7151, lng: 44.8271, big: true },
  { name: 'ბათუმი', lat: 41.6168, lng: 41.6367 },
  { name: 'ქუთაისი', lat: 42.2679, lng: 42.7180 },
  { name: 'რუსთავი', lat: 41.5497, lng: 44.9930 },
  { name: 'გორი', lat: 41.9847, lng: 44.1086 },
  { name: 'ზუგდიდი', lat: 42.5088, lng: 41.8709 },
  { name: 'ფოთი', lat: 42.1463, lng: 41.6711 },
  { name: 'თელავი', lat: 41.9197, lng: 45.4731 },
  { name: 'ახალციხე', lat: 41.6386, lng: 42.9826 },
  { name: 'ოზურგეთი', lat: 41.9244, lng: 42.0073 },
  { name: 'ბორჯომი', lat: 41.8395, lng: 43.3795 },
  { name: 'ქობულეთი', lat: 41.8214, lng: 41.7795 },
  { name: 'სენაკი', lat: 42.2706, lng: 42.0694 },
  { name: 'ზესტაფონი', lat: 42.1110, lng: 43.0383 },
  { name: 'მარნეული', lat: 41.4778, lng: 44.8092 },
  { name: 'მესტია', lat: 43.0458, lng: 42.7290 },
];

export default function GeorgiaMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current, {
        center: [42.05, 43.5],
        zoom: 7,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      CITIES.forEach((c) => {
        const icon = L.divIcon({
          className: '',
          html: `<span class="cs-pin${c.big ? ' cs-pin-lg' : ''}"><span class="cs-pin-dot"></span></span>`,
          iconSize: [0, 0],
        });
        L.marker([c.lat, c.lng], { icon, interactive: true })
          .addTo(map)
          .bindTooltip(c.name, { direction: 'top', offset: [0, -8], opacity: 1 });
      });

      map.fitBounds(
        [
          [41.0, 40.0],
          [43.6, 46.8],
        ],
        { padding: [20, 20] }
      );

      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      const m = mapRef.current as { remove?: () => void } | null;
      if (m?.remove) m.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <style>{`
        .cs-pin{position:relative;display:block;}
        .cs-pin .cs-pin-dot{position:absolute;width:11px;height:11px;left:-5.5px;top:-5.5px;background:#db2777;border-radius:9999px;box-shadow:0 0 0 2px #fff,0 1px 3px rgba(0,0,0,.3);z-index:2;}
        .cs-pin::before{content:'';position:absolute;width:11px;height:11px;left:-5.5px;top:-5.5px;border-radius:9999px;background:#db2777;opacity:.55;animation:csPulse 2.2s ease-out infinite;}
        .cs-pin-lg .cs-pin-dot{width:16px;height:16px;left:-8px;top:-8px;}
        .cs-pin-lg::before{width:16px;height:16px;left:-8px;top:-8px;animation-duration:1.8s;}
        @keyframes csPulse{0%{transform:scale(1);opacity:.55;}100%{transform:scale(4.5);opacity:0;}}
        .leaflet-container{background:#f7f4f1;font-family:inherit;border-radius:1.5rem;z-index:0;}
        .leaflet-pane,.leaflet-top,.leaflet-bottom,.leaflet-control{z-index:1 !important;}
        .leaflet-tooltip{background:#1a1a1a;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:11px;padding:3px 8px;box-shadow:0 4px 12px rgba(0,0,0,.18);}
        .leaflet-tooltip-top:before{border-top-color:#1a1a1a;}
      `}</style>
      <div ref={ref} className="relative z-0 [isolation:isolate] w-full h-[360px] md:h-[520px] rounded-3xl ring-1 ring-black/5 shadow-lg overflow-hidden" />
    </>
  );
}
