'use client';

interface PropertyMapProps {
  location: string;
}

export function PropertyMap({ location }: PropertyMapProps) {
  // Codificar la ubicación para la URL de Google Maps
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_API_KEY&q=${encodedLocation}`;
  
  // Como alternativa sencilla sin API KEY para el embed básico:
  const simpleMapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={simpleMapUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
