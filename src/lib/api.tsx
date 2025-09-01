// lib/api.ts
// const BASE = "http://localhost:5000";
const BASE = "https://real-estate-project-backend-2.onrender.com"; //  Render ka backend
// Attach Authorization header if token is present
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Enhanced parseJson function
const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return { success: res.ok };
  }

  try {
    const data = JSON.parse(text);
    
    if (data.errors && Array.isArray(data.errors)) {
      const validationErrors: { [key: string]: string } = {};
      data.errors.forEach((error: { field: string; message: string }) => {
        validationErrors[error.field] = error.message;
      });
      
      return {
        success: false,
        message: data.message || 'Validation failed',
        errors: validationErrors
      };
    }
    
    return data;
  } catch (e) {
    console.error("JSON parse error:", e, "Response text:", text);
    return { success: false, message: "Invalid JSON response" };
  }
};

/* ---------------- AUTH APIS ---------------- */
export const signupApi = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await parseJson(res);
  
  if (!res.ok) {
    if (data.errors) {
      throw { 
        message: data.message || "Validation failed", 
        errors: data.errors 
      };
    }
    throw new Error(data.message || "Signup failed");
  }
  
  return data;
};

export const loginApi = async (email: string, password: string, role: string) => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await parseJson(res);
  
  if (!res.ok) {
    if (data.errors) {
      throw { 
        message: data.message || "Validation failed", 
        errors: data.errors 
      };
    }
    throw new Error(data.message || "Login failed");
  }
  
  return data;
};

export const verifyToken = async (token: string) => {
  const res = await fetch(`${BASE}/api/auth/verify`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Token verification failed");
  return data;
};

/* ---------------- LISTINGS APIS ---------------- */
export const createListingApi = async (payload: any) => {
  const res = await fetch(`${BASE}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to create listing");
  return data;
};

export const uploadImagesApi = async (listingId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file: File) => {
    formData.append("images", file);
  });

  const res = await fetch(`${BASE}/api/listings/${listingId}/upload-images`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data;
};

export const getListingApi = async (id: string) => {
  try {
    const res = await fetch(`${BASE}/api/listings/${id}`, {
      headers: authHeaders()
    });
    const data = await parseJson(res);

    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch listing: ${res.status}`);
    }

    if (data && data.listing) {
      return data.listing;
    } else if (data && data.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

export const updateListingApi = async (id: string, payload: any) => {
  const res = await fetch(`${BASE}/api/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to update listing");
  return data;
};

export const deleteListingApi = async (id: string) => {
  const res = await fetch(`${BASE}/api/listings/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || "Failed to delete listing");
  return data;
};

export const getListingsApi = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE}/api/listings`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const data = await parseJson(res);

    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch listings: ${res.status}`);
    }

    // Handle different response formats
    let listings = [];
    if (data && data.listings) {
      listings = data.listings;
    } else if (Array.isArray(data)) {
      listings = data;
    } else if (data && data.data) {
      listings = data.data;
    }

    // Ensure all listings have proper image URLs
    const listingsWithImages = listings.map((listing: any) => {
      // Handle both string URLs and ObjectId references
      const images = Array.isArray(listing.images) ? listing.images : [];
      const processedImages = images.map((img: any) => {
        if (typeof img === 'string' && img.startsWith('http')) {
          return img; // Already a URL
        }
        // Convert ObjectId to URL
        return `${BASE}/api/listings/image/${img}`;
      });

      return {
        ...listing,
        images: processedImages
      };
    });

    return {
      success: true,
      listings: listingsWithImages,
    };
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return {
      success: false,
      message: error.message,
      listings: [],
    };
  }
};

export const deleteImageApi = async (listingId: string, imageUrl: string) => {
  const response = await fetch(`/api/listings/${listingId}/images`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ imageUrl }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
  
  return response.json();
};

// Get user info from token
export const getCurrentUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Decode the JWT token to get user information
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.userId,
      role: payload.role,
      name: payload.name,
      email: payload.email
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};