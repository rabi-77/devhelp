import { authApi } from "@/api/auth.api";
import {
  resetPasswordInput,
  resetPasswordSchema,
} from "@/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/shared/Navbar";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}
const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const tokenFromUrl = searchParams.get("token") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<resetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPassword = watch("newPassword");
  useEffect(() => {
    setPasswordValue(newPassword || "");
  }, [newPassword]);
  useEffect(() => {
    if (tokenFromUrl) {
      setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, setValue]);
  const resetPasswordMutation = useMutation({
    mutationFn: (data: resetPasswordInput) => authApi.resetPassword(data),
    onSuccess: (response) => {
      console.log(response.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    },
    onError: (error) => {
      console.error("Reset Password error:", error);
    },
    retry: false,
  });
  const onSubmit = (data: resetPasswordInput) => {
    resetPasswordMutation.mutate(data);
  };
  if (!tokenFromUrl) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This password reset link is invalid or has expired. Please
                  request a new password reset.
                </AlertDescription>
              </Alert>
              <Link to="/forgot-password">
                <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary">
                  Request New Reset Link
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <>
      <Navbar variant="auth" authType="reset-password" />
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {isSuccess ? "Password Reset!" : "Reset Your Password"}
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                {isSuccess
                  ? "Your password has been updated"
                  : "Create a new strong password"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your password has been successfully reset. You can now
                      sign in with your new password.
                    </AlertDescription>
                  </Alert>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50 border border-emerald-100/30">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>Redirecting to login page...</span>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 hover:bg-emerald-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go to Login Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {resetPasswordMutation.isError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {(resetPasswordMutation.error as ApiErrorResponse)
                          ?.response?.data?.error?.message ||
                          "Failed to reset password. Please try again or request a new reset link."}
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Hidden token field */}
                    <input type="hidden" {...register("token")} />
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium"
                      >
                        <Lock className="h-3.5 w-3.5 inline mr-1" />
                        New Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                          onFocus={() => resetPasswordMutation.reset()}
                          {...register("newPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <PasswordStrengthIndicator password={passwordValue} />
                      {errors.newPassword && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        <Lock className="h-3.5 w-3.5 inline mr-1" />
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                          onFocus={() => resetPasswordMutation.reset()}
                          {...register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-4 h-10 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Resetting password...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-emerald-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 py-1 text-muted-foreground font-medium">
                        Remember your password?
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="group text-sm font-medium text-primary hover:text-emerald-600 inline-flex items-center gap-1.5 transition-all duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                      Back to Login
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
            © 2026 devHelp. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
