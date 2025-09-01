// // ResetPassword.tsx
// import React, { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { authAPI } from "@/servises/api";

// const ResetPassword: React.FC = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const resetToken = localStorage.getItem("resetToken");
//   const email = localStorage.getItem("email");

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!resetToken || !email) {
//       toast({
//         title: "Error",
//         description: "Session expired. Please request a new password reset link.",
//         variant: "destructive"
//       });
//       navigate("/forgot-password");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match.",
//         variant: "destructive"
//       });
//       return;
//     }

//     if (newPassword.length < 8) {
//       toast({
//         title: "Error",
//         description: "Password must be at least 8 characters long.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const response = await authAPI.resetPassword(email, resetToken, newPassword);
      
//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "Password reset successfully. Please login with your new password.",
//         });
        
//         localStorage.removeItem("resetToken");
//         localStorage.removeItem("email");
        
//         navigate("/login");
//       } else {
//         toast({
//           title: "Error",
//           description: response.data.message || "Failed to reset password.",
//           variant: "destructive"
//         });
//       }
//     } catch (error: any) {
//       console.error("Error:", error.response?.data);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Something went wrong.",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-1">
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             className="w-fit mb-2"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//           <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
//           <CardDescription className="text-center">
//             Enter your new password
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleResetPassword} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="newPassword">New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="newPassword"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="pr-10"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-500" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="pr-10"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-500" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Password"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ResetPassword;