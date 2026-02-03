import { authApi } from "@/api/auth.api";
import {
  forgotPasswordInput,
  forgotPasswordSchema,
} from "@/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
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
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}
const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<forgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: forgotPasswordInput) => {
      console.log("🚀 Sending forgot password request to backend:", data);
      return authApi.forgotPassword(data);
    },
    onSuccess: (response) => {
      console.log("✅ Backend response received:", response);
      setIsSuccess(true);
    },
    onError: (error) => {
      console.error("❌ Forgot Password error:", error);
    },
    retry: false,
  });
  const onSubmit = (data: forgotPasswordInput) => {
    console.log("📝 Form submitted, calling mutation...");
    forgotPasswordMutation.mutate(data);
  };
  return (
    <>
      <Navbar variant="auth" authType="forgot-password" />
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {isSuccess ? "Check Your Email" : "Forgot Password?"}
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                {isSuccess
                  ? "We've sent you reset instructions"
                  : "No worries, we'll send you reset instructions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      If an account exists with{" "}
                      <span className="font-semibold">
                        {getValues("email")}
                      </span>
                      , you will receive password reset instructions. Please
                      check your inbox.
                    </AlertDescription>
                  </Alert>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50 border border-emerald-100/30">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-foreground">
                          What's next?
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Check your email inbox</li>
                          <li>• Click the reset link in the email</li>
                          <li>• Create a new password</li>
                          <li>• Sign in with your new password</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        forgotPasswordMutation.reset();
                      }}
                      className="text-primary hover:text-emerald-600 font-medium underline underline-offset-2"
                    >
                      try again
                    </button>
                  </div>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 hover:bg-emerald-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {forgotPasswordMutation.isError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {(forgotPasswordMutation.error as ApiErrorResponse)
                          ?.response?.data?.error?.message ||
                          "Something went wrong. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => forgotPasswordMutation.reset()}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Enter the email address associated with your account
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-4 h-10 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
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
                          Sending instructions...
                        </span>
                      ) : (
                        "Send Reset Instructions"
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
export default ForgotPassword;
