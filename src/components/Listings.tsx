// components/Listings.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin } from 'lucide-react';
import { getListingsApi } from '@/lib/api';

const Listings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListingsApi();
        
        if (data && data.success && Array.isArray(data.listings)) {
          setListings(data.listings);
        } else if (Array.isArray(data)) {
          setListings(data);
        } else {
          setError(data?.message || "Failed to load listings");
          setListings([]);
        }
      } catch (err: any) {
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  // Filter listings based on search term
  const filteredListings = listings.filter(listing =>
    listing.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p>Loading properties...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Listings</h1>
          <p className="text-gray-600">Find your perfect home</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, property type, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {!filteredListings || filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No results for "${searchTerm}"` : 'Be the first to create a listing!'}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mr-2"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredListings.length} of {listings.length} properties
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <PropertyCard
                  key={listing._id}
                  property={{
                    id: listing._id,
                    title: listing.name,
                    location: listing.address,
                    price: `₹${listing.regularPrice?.toLocaleString('en-IN')}`,
                    rentPrice: listing.type === 'rent' ? `₹${listing.regularPrice}/month` : undefined,
                    type: listing.type,
                    propertyType: listing.propertyType || 'Residential',
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    area: listing.squareFootage || listing.area || '0',
                    image: listing.images?.[0], // This will show the uploaded image
                    featured: listing.offer,
                    verified: true,
                  }}
                  onView={() => navigate(`/listing/${listing._id}`)}
                  onContact={() => console.log('Contact seller:', listing._id)}
                  onFavorite={() => console.log('Add to favorites:', listing._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;