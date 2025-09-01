// components/PropertyCard.tsx
import { useState } from "react";
import { Heart, MapPin, Verified, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    rentPrice?: string;
    type: "rent" | "sale";
    propertyType?: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image?: string;
    sellerPackage?: "silver" | "gold" | "platinum" | "basic";
    featured?: boolean;
    verified?: boolean;
    userRef?: string;
  };
  onView: () => void;
  onContact: () => void;
  onFavorite: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PropertyCard = ({ 
  property, 
  onView, 
  onContact, 
  onFavorite, 
  showActions = false,
  onEdit,
  onDelete
}: PropertyCardProps) => {
  // Handle image loading errors
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image Section */}
      <div className="relative">
        {property.image && !imageError ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-green-600 text-white px-2 py-1 text-xs">
            {property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </Badge>
          
          {property.verified && (
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs flex items-center gap-1">
              <Verified className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full h-8 w-8 shadow-sm"
          onClick={onFavorite}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {property.price}
          </span>
          {property.rentPrice && (
            <span className="text-sm text-gray-600 ml-2">{property.rentPrice}</span>
          )}
        </div>

        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-bold text-gray-900 text-lg">{property.bedrooms}</div>
            <div className="text-xs text-gray-600 font-medium">Bedrooms</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 text-lg">{property.bathrooms}</div>
            <div className="text-xs text-gray-600 font-medium">Bathrooms</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 text-lg">{property.area}</div>
            <div className="text-xs text-gray-600 font-medium">Sq Ft</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mb-4">
          <Badge variant="outline" className="text-gray-700 bg-gray-100">
            {property.propertyType || 'Residential'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-sm h-9"
            onClick={onView}
          >
            View Details
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
            onClick={onContact}
          >
            Contact
          </Button>
        </div>

        {/* Edit/Delete Actions */}
        {showActions && onEdit && onDelete && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-sm h-8"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 text-sm h-8"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;