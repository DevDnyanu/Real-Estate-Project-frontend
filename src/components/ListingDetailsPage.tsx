// components/ListingDetailsPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath,
  Car,
  Sofa,
  Tag,
  Ruler,
  Phone,
  Edit,
  ArrowLeft,
  User,
  Verified,
  ChevronLeft,
  ChevronRight,
  ImageIcon
} from "lucide-react";
import { getListingApi } from "@/lib/api";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) {
          setError("No listing ID provided");
          setLoading(false);
          return;
        }

        const listingData = await getListingApi(id);
        setListing(listingData);
      } catch (err: any) {
        console.error("Error fetching listing:", err);
        setError(err.message || "Failed to fetch listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const nextImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) return <div className="p-8 text-center">Loading property details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!listing) return <div className="p-8 text-center">No listing found</div>;

  // Format price with Indian numbering system
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
          
          <Button 
            onClick={() => navigate(`/edit/${listing._id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Listing
          </Button>
        </div>

        {/* Property Title and Verification */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
          {listing.verified && (
            <Badge className="bg-green-500 text-white flex items-center gap-1">
              <Verified className="h-4 w-4" />
              Verified
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <MapPin className="h-4 w-4" />
          <span>{listing.address}</span>
        </div>

        {/* Main Image with Carousel */}
        <div className="mb-8 relative">
          {listing.images && listing.images.length > 0 ? (
            <div className="relative group">
              {!imageErrors.has(currentImageIndex) ? (
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.name}
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">Image not available</p>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {listing.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {listing.images && listing.images.length > 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              All Images ({listing.images.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.images.map((image: string, index: number) => (
                <div 
                  key={index} 
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {!imageErrors.has(index) ? (
                    <img
                      src={image}
                      alt={`${listing.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Property Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{listing.bedrooms || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bath className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{listing.bathrooms || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Ruler className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area (Sq Ft)</p>
                    <p className="font-semibold">{listing.squareFootage || listing.area || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">{listing.type || 'sale'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description || "No description provided"}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
              <div className="flex flex-wrap gap-4">
                {listing.parking && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-full">
                    <Car className="h-4 w-4" />
                    <span>Parking Available</span>
                  </div>
                )}
                
                {listing.furnished && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-full">
                    <Sofa className="h-4 w-4" />
                    <span>Fully Furnished</span>
                  </div>
                )}
                
                {listing.offer && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-full">
                    <Tag className="h-4 w-4" />
                    <span>Special Offer</span>
                  </div>
                )}
                
                {!listing.parking && !listing.furnished && !listing.offer && (
                  <p className="text-gray-500">No special features listed</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </h2>
              
              {listing.contactNumber ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-blue-800">{listing.contactNumber}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                    Call Now
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Contact number not provided</p>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Summary */}
          <div>
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Pricing Details
              </h2>
              
              <div className="space-y-4">
                {listing.offer && listing.discountPrice > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Regular Price:</span>
                      <span className="text-lg line-through text-red-600">
                        ₹{formatPrice(listing.regularPrice)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discounted Price:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{formatPrice(listing.discountPrice)}
                      </span>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-700 font-medium text-center">
                        You save ₹{formatPrice(listing.regularPrice - listing.discountPrice)}
                        {listing.type === 'rent' ? ' per month' : ''}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <span className="text-gray-600 text-sm block mb-1">
                      {listing.type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
                    </span>
                    <span className="text-3xl font-bold text-blue-600 block">
                      ₹{formatPrice(listing.regularPrice)}
                    </span>
                    {listing.type === 'rent' && (
                      <p className="text-sm text-gray-500 mt-1">Excluding maintenance and utilities</p>
                    )}
                  </div>
                )}
                
                {listing.type === 'rent' && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-700 text-sm text-center">
                      Security deposit may apply
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Property Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Property Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="font-mono text-blue-600">{listing._id?.substring(0, 8).toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Listing Type:</span>
                  <span className="font-medium capitalize">{listing.type || 'sale'}</span>
                </div>
                
                <div className="flex justify between items-center py-2 border-b">
                  <span className="text-gray-600">Total Images:</span>
                  <span className="font-medium">{listing.images?.length || 0}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Property Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                
                {listing.createdAt && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Listed on:</span>
                    <span className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                {listing.updatedAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">
                      {new Date(listing.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingDetailsPage;