import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

export default function SpaceCard({ space }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Fixed-height image area*/}
      <div className="w-full h-60 overflow-hidden">
        <img
          src={space.main_image}
          alt={space.name}
          className="w-full h-full object-cover block"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-stone-800 flex-1 mr-2 leading-tight">
            {space.name}
          </h3>
          <span className="text-base font-bold text-stone-800 flex-shrink-0">
            ₱{space.price}
          </span>
        </div>

        <p className="text-stone-600 text-xs mb-2 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {space.location}
        </p>

        <p className="text-stone-600 text-xs line-clamp-3 mb-3">
          {space.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {space.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {space.amenities.length > 3 && (
            <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
              +{space.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-stone-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {space.hours}
          </span>

          <Link
            to={`/space/${space.id}`}
            className="bg-[#a88e73] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#766351] transition-colors"
          >
            View Details & Book
          </Link>
        </div>
      </div>
    </div>
  );
}