// // components/UserListings.tsx
// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Home, 
//   Edit, 
//   Trash2, 
//   Plus,
//   MapPin,
//   Bed,
//   Bath,
//   Ruler,
//   DollarSign,
//   Eye
// } from 'lucide-react';
// import { getUserListingsApi, deleteListingApi } from '@/lib/api';

// const UserListings = () => {
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUserListings();
//   }, []);

//   const fetchUserListings = async () => {
//     try {
//       setLoading(true);
//       const userListings = await getUserListingsApi();
//       setListings(userListings);
//     } catch (error: any) {
//       console.error('Error fetching user listings:', error);
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to fetch your listings',
//         variant: 'destructive'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (listingId: string) => {
//     if (!window.confirm('Are you sure you want to delete this listing?')) {
//       return;
//     }

//     try {
//       setDeletingId(listingId);
//       await deleteListingApi(listingId);
      
//       toast({
//         title: 'Success',
//         description: 'Listing deleted successfully',
//         variant: 'default'
//       });
      
//       // Refresh the listings
//       fetchUserListings();
//     } catch (error: any) {
//       console.error('Error deleting listing:', error);
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to delete listing',
//         variant: 'destructive'
//       });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-IN').format(price);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center">Loading your listings...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Property Listings</h1>
//           <Button onClick={() => navigate('/create-listing')}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add New Property
//           </Button>
//         </div>

//         {listings.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <Home className="h-16 w-16 text-gray-400 mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
//               <p className="text-gray-500 text-center mb-4">
//                 You haven't created any property listings yet. Start by creating your first listing.
//               </p>
//               <Button onClick={() => navigate('/create-listing')}>
//                 Create Your First Listing
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {listings.map((listing) => (
//               <Card key={listing._id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                 <div className="aspect-video overflow-hidden">
//                   <img
//                     src={listing.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
//                     alt={listing.name}
//                     className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
//                   />
//                 </div>
                
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg truncate">{listing.name}</CardTitle>
//                   <div className="flex items-center gap-1 text-sm text-gray-600">
//                     <MapPin className="h-4 w-4" />
//                     <span className="truncate">{listing.address}</span>
//                   </div>
//                 </CardHeader>
                
//                 <CardContent>
//                   <div className="grid grid-cols-3 gap-2 mb-4">
//                     <div className="text-center">
//                       <Bed className="h-5 w-5 mx-auto text-blue-600" />
//                       <p className="text-sm font-semibold">{listing.bedrooms}</p>
//                       <p className="text-xs text-gray-600">Beds</p>
//                     </div>
//                     <div className="text-center">
//                       <Bath className="h-5 w-5 mx-auto text-blue-600" />
//                       <p className="text-sm font-semibold">{listing.bathrooms}</p>
//                       <p className="text-xs text-gray-600">Baths</p>
//                     </div>
//                     <div className="text-center">
//                       <Ruler className="h-5 w-5 mx-auto text-blue-600" />
//                       <p className="text-sm font-semibold">{listing.squareFootage}</p>
//                       <p className="text-xs text-gray-600">Sq Ft</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-1">
//                       <DollarSign className="h-4 w-4 text-green-600" />
//                       <span className="font-bold text-green-600">
//                         ₹{formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
//                       </span>
//                     </div>
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
//                       {listing.type}
//                     </span>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       className="flex-1"
//                       onClick={() => navigate(`/edit/${listing._id}`)}
//                     >
//                       <Edit className="h-4 w-4 mr-1" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={() => navigate(`/listing/${listing._id}`)}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleDelete(listing._id)}
//                       disabled={deletingId === listing._id}
//                     >
//                       {deletingId === listing._id ? (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       ) : (
//                         <Trash2 className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserListings;