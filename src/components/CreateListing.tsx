// components/CreateListing.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MapPin, 
  FileText, 
  DollarSign, 
  Bed, 
  Bath,
  Car,
  Sofa,
  Tag,
  AlertCircle,
  Upload,
  Phone,
  Ruler,
  X,
  Edit3,
  ImageIcon
} from 'lucide-react';
import { createListingApi, uploadImagesApi } from '@/lib/api';

const CreateListing = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 500,
    contactNumber: '',
    regularPrice: 1000000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: localStorage.getItem('userId') || 'public',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    contactNumber: '',
    regularPrice: '',
    discountPrice: '',
    images: ''
  });

  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);
  const [textDataSubmitted, setTextDataSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Property name is required';
    if (name.length < 10) return 'Name must be at least 10 characters';
    if (name.length > 62) return 'Name cannot exceed 62 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return 'Address is required';
    if (address.length < 15) return 'Please enter a complete address';
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) return 'Please enter a valid address';
    return '';
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) return 'Description is required';
    if (description.length < 50) return 'Description must be at least 50 characters';
    const words = description.split(/\s+/).filter(word => word.length >= 3);
    if (words.length < 5) return 'Description should contain meaningful content';
    return '';
  };

  const validateContactNumber = (number: string) => {
    if (!number.trim()) return 'Contact number is required';
    if (!/^[0-9]{10}$/.test(number)) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateNumber = (value: number, field: string, min: number, max: number) => {
    if (isNaN(value)) return `${field} must be a number`;
    if (value < min) return `${field} cannot be less than ${min}`;
    if (value > max) return `${field} cannot be more than ${max}`;
    return '';
  };

  const validateSquareFootage = (value: number) => {
    return validateNumber(value, 'Square footage', 500, 10000);
  };

  const validatePrice = (price: number, isDiscount = false) => {
    if (isNaN(price)) return 'Price must be a number';
    if (price < (isDiscount ? 0 : 1000000)) return `Price cannot be less than ${isDiscount ? '0' : '₹10,00,000'}`;
    if (price > 20000000) return 'Price cannot exceed ₹2,00,00,000';
    return '';
  };

  const validateDiscountPrice = (discountPrice: number, regularPrice: number) => {
    if (discountPrice >= regularPrice) return 'Discount price must be less than regular price';
    return validatePrice(discountPrice, true);
  };

  const validateImages = (files: File[]) => {
    if (files.length === 0) return 'Please upload at least one image';
    if (files.length > 6) return 'You can upload a maximum of 6 images';
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return 'Only image files are allowed';
      }
      if (file.size > 5 * 1024 * 1024) {
        return 'Each image should be less than 5MB';
      }
    }
    
    return '';
  };

  // Validate individual field on change
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'address':
        return validateAddress(value);
      case 'description':
        return validateDescription(value);
      case 'contactNumber':
        return validateContactNumber(value);
      case 'bedrooms':
        return validateNumber(value, 'Bedrooms', 1, 6);
      case 'bathrooms':
        return validateNumber(value, 'Bathrooms', 1, 6);
      case 'squareFootage':
        return validateSquareFootage(value);
      case 'regularPrice':
        return validatePrice(value);
      case 'discountPrice':
        return validateDiscountPrice(value, formData.regularPrice);
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
      setErrors({ ...errors, type: '' });
      return;
    }
    
    if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData({ ...formData, [id]: (e.target as HTMLInputElement).checked });
      return;
    }
    
    const isNumber = e.target.type === 'number';
    let newValue = isNumber ? parseInt(value) || 0 : value;
    
    // Prevent zero values for certain fields
    if (isNumber && ['bedrooms', 'bathrooms', 'regularPrice', 'squareFootage'].includes(id) && newValue === 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [id]: newValue,
    });
    
    // Validate the field and set error
    if (id !== 'type') {
      setErrors({
        ...errors,
        [id]: validateField(id, newValue)
      });
    }
  };

  // Handle number input with keyboard events
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === '0' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
    }
  };

  // Handle increment/decrement for number inputs
  const handleNumberChange = (field: string, increment: boolean) => {
    const currentValue = formData[field as keyof typeof formData] as number;
    let newValue = increment ? currentValue + 1 : currentValue - 1;
    
    // Set minimum values
    if (field === 'bedrooms' || field === 'bathrooms') {
      newValue = Math.max(1, Math.min(6, newValue));
    } else if (field === 'regularPrice') {
      newValue = Math.max(1000000, Math.min(20000000, newValue));
    } else if (field === 'squareFootage') {
      newValue = Math.max(500, Math.min(10000, newValue));
    }
    
    setFormData({
      ...formData,
      [field]: newValue,
    });
    
    setErrors({
      ...errors,
      [field]: validateField(field, newValue)
    });
  };

  // Handle image upload with preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    const filesArray = Array.from(selectedFiles);
    const newFiles = [...files, ...filesArray].slice(0, 6); // Limit to 6 images
    
    const imageError = validateImages(newFiles);
    if (imageError) {
      setImageUploadError(imageError);
      return;
    }
    
    setFiles(newFiles);
    setImageUploadError('');
  };

  // Remove specific image
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImageUploadError('');
  };

  // Replace specific image
  const replaceImage = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setImageUploadError('Image should be less than 5MB');
          return;
        }
        if (!file.type.startsWith('image/')) {
          setImageUploadError('Only image files are allowed');
          return;
        }
        
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
        setImageUploadError('');
      }
    };
    input.click();
  };

  // Upload images after text data is submitted
 // components/CreateListing.tsx (partial update for image handling)
const uploadImages = async () => {
  if (!listingId || files.length === 0) {
    setImageUploadError('Please select at least one image');
    return;
  }
  
  try {
    setUploading(true);
    setImageUploadError('');
    
    const imageError = validateImages(files);
    if (imageError) {
      setImageUploadError(imageError);
      return;
    }
    
    const response = await uploadImagesApi(listingId, files);
    
    if (response.success) {
      toast({ 
        title: 'Success', 
        description: 'Listing created with images successfully!',
        variant: 'default'
      });
      
      // Reload the listings to see the new listing with images
      navigate('/properties');
    } else {
      setImageUploadError('Failed to upload images');
    }
  } catch (e: any) {
    console.error('Error uploading images:', e);
    setImageUploadError(e.message || 'Failed to upload images');
  } finally {
    setUploading(false);
  }
};

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      description: validateDescription(formData.description),
      address: validateAddress(formData.address),
      type: formData.type ? '' : 'Please select either Rent or Sell',
      bedrooms: validateNumber(formData.bedrooms, 'Bedrooms', 1, 6),
      bathrooms: validateNumber(formData.bathrooms, 'Bathrooms', 1, 6),
      squareFootage: validateSquareFootage(formData.squareFootage),
      contactNumber: validateContactNumber(formData.contactNumber),
      regularPrice: validatePrice(formData.regularPrice),
      discountPrice: formData.offer ? validateDiscountPrice(formData.discountPrice, formData.regularPrice) : '',
      images: ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      setSubmitError('');

      const data = await createListingApi(formData);
      setListingId(data.listingId);
      setTextDataSubmitted(true);
      
      toast({ 
        title: 'Success', 
        description: 'Listing created successfully! Please upload images.',
        variant: 'default'
      });
    } catch (e: any) {
      console.error('Error creating listing:', e);
      setSubmitError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Parse formatted price back to number
  const parsePrice = (formattedPrice: string) => {
    return parseInt(formattedPrice.replace(/,/g, '')) || 0;
  };

  // Handle price input with formatting
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const numericValue = parsePrice(value);
    
    if (field === 'regularPrice' && numericValue === 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [field]: numericValue
    });
    
    setErrors({
      ...errors,
      [field]: field === 'discountPrice' 
        ? validateDiscountPrice(numericValue, formData.regularPrice) 
        : validatePrice(numericValue)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Property Listing</h1>
          </div>
          <p className="text-sm text-gray-600">Fill in the details to create your property listing</p>
        </div>

        {!textDataSubmitted ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Basic Info */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Property Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter property name (letters only)"
                    maxLength={62}
                    required
                    onChange={handleChange}
                    value={formData.name}
                    className="h-9 text-sm"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter complete address"
                    required
                    onChange={handleChange}
                    value={formData.address}
                    className="h-9 text-sm"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                    <Phone className="h-3 w-3 inline mr-1" />
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    onChange={handleChange}
                    value={formData.contactNumber}
                    className="h-9 text-sm"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Describe your property in detail (minimum 50 characters)..."
                    className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                    required
                    rows={2}
                    onChange={handleChange}
                    value={formData.description}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Middle Column - Property Details */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-4 w-4 text-blue-600" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Property Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      formData.type === 'sale' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        id="sale"
                        className="w-4 h-4 text-blue-600"
                        onChange={handleChange}
                        checked={formData.type === 'sale'}
                      />
                      <span className="font-medium">For Sale</span>
                    </label>
                    
                    <label className={`flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      formData.type === 'rent' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        id="rent"
                        className="w-4 h-4 text-blue-600"
                        onChange={handleChange}
                        checked={formData.type === 'rent'}
                      />
                      <span className="font-medium">For Rent</span>
                    </label>
                  </div>
                  {errors.type && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Square Footage */}
                <div className="space-y-1">
                  <Label htmlFor="squareFootage" className="text-sm font-medium text-gray-700">
                    <Ruler className="h-3 w-3 inline mr-1" />
                    Square Footage (sq ft) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => handleNumberChange('squareFootage', false)}
                      disabled={formData.squareFootage <= 500}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      id="squareFootage"
                      min="500"
                      max="10000"
                      required
                      className="h-9 text-center rounded-none border-l-0 border-r-0"
                      onChange={handleChange}
                      onKeyDown={(e) => handleNumberInput(e, 'squareFootage')}
                      value={formData.squareFootage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => handleNumberChange('squareFootage', true)}
                      disabled={formData.squareFootage >= 10000}
                    >
                      +
                    </Button>
                  </div>
                  {errors.squareFootage && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.squareFootage}
                    </p>
                  )}
                </div>

                {/* Property Features */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Property Features</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className={`flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      formData.parking 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        id="parking"
                        className="w-4 h-4 text-green-600"
                        onChange={handleChange}
                        checked={formData.parking}
                      />
                      <Car className="h-4 w-4" />
                      <span className="font-medium">Parking</span>
                    </label>

                    <label className={`flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      formData.furnished 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        id="furnished"
                        className="w-4 h-4 text-green-600"
                        onChange={handleChange}
                        checked={formData.furnished}
                      />
                      <Sofa className="h-4 w-4" />
                      <span className="font-medium">Furnished</span>
                    </label>

                    <label className={`flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      formData.offer 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        id="offer"
                        className="w-4 h-4 text-orange-600"
                        onChange={handleChange}
                        checked={formData.offer}
                      />
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">Special Offer</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Pricing & Submit */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Details & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                      <Bed className="h-3 w-3 inline mr-1" />
                      Bedrooms <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => handleNumberChange('bedrooms', false)}
                        disabled={formData.bedrooms <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="6"
                        required
                        className="h-9 text-center rounded-none border-l-0 border-r-0"
                        onChange={handleChange}
                        onKeyDown={(e) => handleNumberInput(e, 'bedrooms')}
                        value={formData.bedrooms}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => handleNumberChange('bedrooms', true)}
                        disabled={formData.bedrooms >= 6}
                      >
                        +
                      </Button>
                    </div>
                    {errors.bedrooms && (
                      <p className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">
                      <Bath className="h-3 w-3 inline mr-1" />
                      Bathrooms <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => handleNumberChange('bathrooms', false)}
                        disabled={formData.bathrooms <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="6"
                        required
                        className="h-9 text-center rounded-none border-l-0 border-r-0"
                        onChange={handleChange}
                        onKeyDown={(e) => handleNumberInput(e, 'bathrooms')}
                        value={formData.bathrooms}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => handleNumberChange('bathrooms', true)}
                        disabled={formData.bathrooms >= 6}
                      >
                        +
                      </Button>
                    </div>
                    {errors.bathrooms && (
                      <p className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="regularPrice" className="text-sm font-medium text-gray-700">
                      Regular Price (₹10L - ₹2Cr) <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => handleNumberChange('regularPrice', false)}
                        disabled={formData.regularPrice <= 1000000}
                      >
                        -
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          id="regularPrice"
                          required
                          className="h-9 text-sm pl-6 rounded-none border-l-0 border-r-0"
                          onChange={(e) => handlePriceChange(e, 'regularPrice')}
                          value={formatPrice(formData.regularPrice)}
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => handleNumberChange('regularPrice', true)}
                        disabled={formData.regularPrice >= 20000000}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formData.type === 'rent' ? 'Per month' : 'Total price'}
                    </p>
                    {errors.regularPrice && (
                      <p className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.regularPrice}
                      </p>
                    )}
                  </div>

                  {formData.offer && (
                    <div className="space-y-1">
                      <Label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">
                        Discount Price <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          id="discountPrice"
                          required
                          className="h-9 text-sm pl-6"
                          onChange={(e) => handlePriceChange(e, 'discountPrice')}
                          value={formatPrice(formData.discountPrice)}
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.type === 'rent' ? 'Per month' : 'Total price'}
                      </p>
                      {errors.discountPrice && (
                        <p className="text-red-600 text-xs flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.discountPrice}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.offer && formData.regularPrice > 0 && formData.discountPrice > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-green-700 text-sm">
                        <Tag className="h-3 w-3" />
                        <span className="font-medium">
                          Savings: ₹{formatPrice(formData.regularPrice - formData.discountPrice)}
                          {formData.type === 'rent' ? '/month' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button and Error */}
                <div className="space-y-3 pt-2">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="text-red-700 text-sm text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {submitError}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    disabled={loading} 
                    className="w-full h-10 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl" 
                    type="submit"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Property Listing'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        ) : (
          /* Image Upload Section with Enhanced Preview and Edit */
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-4 w-4 text-blue-600" />
                Upload Property Images ({files.length}/6)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload Input */}
              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                  Select Images (Maximum 6) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="h-9 text-sm"
                  disabled={files.length >= 6}
                />
                <p className="text-xs text-gray-500">
                  Upload up to 6 images of your property (each under 5MB). Click edit button to replace individual images.
                </p>
                
                {imageUploadError && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {imageUploadError}
                  </p>
                )}
              </div>

              {/* Image Preview Grid with Edit Options */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Selected Images Preview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Image Number Badge */}
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                        
                        {/* Edit and Remove Buttons (appear on hover) */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                            onClick={() => replaceImage(index)}
                            title="Replace image"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Image Info */}
                        <div className="mt-2 text-center">
                          <p className="text-xs text-gray-600 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Images Placeholder */}
                    {files.length < 6 && (
                      <div 
                        className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        onClick={() => document.getElementById('images')?.click()}
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Add More</p>
                        <p className="text-xs text-gray-500">{6 - files.length} remaining</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={uploadImages}
                  disabled={uploading || files.length === 0}
                  className="flex-1 h-11 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading Images...
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {files.length} Image{files.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/listing/${listingId}`)}
                  className="h-11 text-sm px-6"
                >
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateListing;