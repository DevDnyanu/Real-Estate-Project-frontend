// // VerifyOTP.tsx
// import React, { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import { authAPI } from "@/servises/api";

// const VerifyOTP: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleVerifyOTP = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !otp) {
//       toast({
//         title: "Error",
//         description: "Please enter both email and OTP.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await authAPI.verifyOtp(email, otp);

//       if (response.data.success && response.data.data) {
//         toast({
//           title: "Success",
//           description: "OTP verified successfully!",
//         });

//         // Store resetToken in localStorage
//         localStorage.setItem("resetToken", response.data.data.resetToken);
//         localStorage.setItem("email", email);

//         navigate("/reset-password");
//       } else {
//         toast({
//           title: "Error",
//           description: response.data.message || "OTP verification failed!",
//           variant: "destructive",
//         });
//       }
//     } catch (error: any) {
//       console.error("Error:", error.response?.data);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "OTP verification failed!",
//         variant: "destructive",
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
//           <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
//           <CardDescription className="text-center">
//             Enter the verification code sent to your email
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleVerifyOTP} className="space-y-4">
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
//             <div className="space-y-2">
//               <Label htmlFor="otp">Verification Code</Label>
//               <Input
//                 id="otp"
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Verifying..." : "Verify OTP"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default VerifyOTP;
