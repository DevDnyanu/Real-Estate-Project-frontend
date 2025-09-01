// // ForgotPassword.tsx
// import React, { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import { authAPI } from "@/servises/api";

// const ForgotPassword: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid email address.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const response = await authAPI.forgotPassword(email);
      
//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "OTP sent to your email.",
//         });
//         navigate("/verify-otp");
//       } else {
//         toast({
//           title: "Error",
//           description: response.data.message || "Something went wrong, please try again.",
//           variant: "destructive"
//         });
//       }
//     } catch (error: any) {
//       console.error("Error:", error.response?.data);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Something went wrong. Please try again.",
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
//           <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
//           <CardDescription className="text-center">
//             Enter your email to receive a verification code
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleForgotPassword} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isLoading}
//             >
//               {isLoading ? "Sending..." : "Send OTP"}
//             </Button>
//           </form>
//           <div className="text-center mt-4">
//             <Button 
//               variant="link" 
//               onClick={() => navigate("/login")}
//             >
//               Back to Login
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ForgotPassword;