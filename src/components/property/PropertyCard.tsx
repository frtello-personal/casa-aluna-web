/**
 * Property Card Component
 * Displays property information in a card format
 */

import { Property } from '@/types';
import { Button } from '@/components/ui/Button';

interface PropertyCardProps {
  property: Property;
  onBookClick: () => void;
}

export function PropertyCard({ property, onBookClick }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        {/* Image will be added with Next.js Image component */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Property Image
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.city}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>{property.bedrooms} habitaciones</span>
          <span>{property.bathrooms} baños</span>
          <span>Hasta {property.maxGuests} huéspedes</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${property.pricePerNight.toLocaleString('es-CO')}
            </span>
            <span className="text-gray-600 text-sm"> / noche</span>
          </div>
          
          <Button onClick={onBookClick} size="sm">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
}
