'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/* Georgian cities — nationwide delivery coverage. 4 majors highlighted. */
const CITIES: Array<{ name: string; lat: number; lng: number; big?: boolean }> = [
  { name: 'თბილისი', lat: 41.7151, lng: 44.8271, big: true },
  { name: 'ბათუმი', lat: 41.6168, lng: 41.6367, big: true },
  { name: 'ქუთაისი', lat: 42.2679, lng: 42.7180, big: true },
  { name: 'რუსთავი', lat: 41.5497, lng: 44.9930, big: true },
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
  { name: 'ხაშური', lat: 41.9988, lng: 43.5996 },
  { name: 'სამტრედია', lat: 42.1611, lng: 42.3419 },
  { name: 'კასპი', lat: 41.9211, lng: 44.4239 },
  { name: 'ჭიათურა', lat: 42.2900, lng: 43.2925 },
  { name: 'წყალტუბო', lat: 42.3411, lng: 42.6011 },
  { name: 'საგარეჯო', lat: 41.7333, lng: 45.3333 },
  { name: 'გარდაბანი', lat: 41.4592, lng: 45.0903 },
  { name: 'ტყიბული', lat: 42.3500, lng: 42.9989 },
  { name: 'ხონი', lat: 42.3167, lng: 42.4167 },
  { name: 'ბოლნისი', lat: 41.4481, lng: 44.5386 },
  { name: 'ახალქალაქი', lat: 41.4078, lng: 43.4861 },
  { name: 'გურჯაანი', lat: 41.7430, lng: 45.7980 },
  { name: 'ყვარელი', lat: 41.9522, lng: 45.8147 },
  { name: 'ლაგოდეხი', lat: 41.8264, lng: 46.2767 },
  { name: 'დედოფლისწყარო', lat: 41.4656, lng: 46.1064 },
  { name: 'სიღნაღი', lat: 41.6175, lng: 45.9219 },
  { name: 'მცხეთა', lat: 41.8458, lng: 44.7203 },
  { name: 'დუშეთი', lat: 42.0853, lng: 44.6986 },
  { name: 'სტეფანწმინდა', lat: 42.6566, lng: 44.6433 },
  { name: 'ამბროლაური', lat: 42.5211, lng: 43.1411 },
  { name: 'ონი', lat: 42.5797, lng: 43.4467 },
  { name: 'წალენჯიხა', lat: 42.6047, lng: 42.0900 },
  { name: 'მარტვილი', lat: 42.4150, lng: 42.3792 },
  { name: 'აბაშა', lat: 42.2042, lng: 42.2058 },
  { name: 'ლანჩხუთი', lat: 42.0900, lng: 42.0336 },
  { name: 'ჩოხატაური', lat: 41.8333, lng: 42.2500 },
  { name: 'ხობი', lat: 42.3167, lng: 41.9000 },
  { name: 'ვანი', lat: 42.0833, lng: 42.5167 },
  { name: 'საჩხერე', lat: 42.3417, lng: 43.4083 },
  { name: 'ნინოწმინდა', lat: 41.2667, lng: 43.5944 },
  { name: 'ახმეტა', lat: 42.0319, lng: 45.2089 },
  { name: 'ბაკურიანი', lat: 41.7497, lng: 43.5328 },
  { name: 'ანაკლია', lat: 42.3878, lng: 41.5658 },
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
        .cs-pin .cs-pin-dot{position:absolute;width:9px;height:9px;left:-4.5px;top:-4.5px;background:#db2777;border-radius:9999px;box-shadow:0 0 0 1.5px #fff,0 1px 2px rgba(0,0,0,.3);z-index:2;}
        .cs-pin::before{content:'';position:absolute;width:9px;height:9px;left:-4.5px;top:-4.5px;border-radius:9999px;background:#db2777;opacity:.45;animation:csPulse 2.4s ease-out infinite;}
        .cs-pin-lg .cs-pin-dot{width:15px;height:15px;left:-7.5px;top:-7.5px;box-shadow:0 0 0 2px #fff,0 1px 3px rgba(0,0,0,.35);}
        .cs-pin-lg::before{width:15px;height:15px;left:-7.5px;top:-7.5px;opacity:.55;animation-duration:1.9s;}
        @keyframes csPulse{0%{transform:scale(1);opacity:.5;}100%{transform:scale(4);opacity:0;}}
        .leaflet-container{background:#f7f4f1;font-family:inherit;border-radius:1.5rem;z-index:0;}
        .leaflet-pane,.leaflet-top,.leaflet-bottom,.leaflet-control{z-index:1 !important;}
        .leaflet-tooltip{background:#1a1a1a;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:11px;padding:3px 8px;box-shadow:0 4px 12px rgba(0,0,0,.18);}
        .leaflet-tooltip-top:before{border-top-color:#1a1a1a;}
      `}</style>
      <div ref={ref} className="relative z-0 [isolation:isolate] w-full h-[360px] md:h-[520px] rounded-3xl ring-1 ring-black/5 shadow-lg overflow-hidden" />
    </>
  );
}
