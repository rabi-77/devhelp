import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { signupInput, signupSchema } from "@/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { getRedirectPath } from "@/utils/redirect";
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/shared/Navbar";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  User,
  Mail,
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
const SignUp = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<signupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      password: "",
      agreeToTerms: false,
    },
  });
  const password = watch("password");
  useEffect(() => {
    setPasswordValue(password || "");
  }, [password]);
  const signupMutation = useMutation({
    mutationFn: (data: signupInput) => authApi.signup(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      navigate(getRedirectPath(response.data.redirectTo), { replace: true });
    },
    onError: (error) => {
      console.log("Signup error:", error);
    },
    retry: false,
  });
  const onSubmit = (data: signupInput, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    signupMutation.mutate(data);
  };
  return (
    <>
      <Navbar variant="auth" authType="signup" />
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Create Your Workspace
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                Start your journey with devHelp today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signupMutation.isError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(signupMutation.error as ApiErrorResponse)?.response?.data
                      ?.error?.message ||
                      "Failed to create account. Please try again."}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Company Information Section */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50 border border-emerald-100/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">
                      Company Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-medium"
                      >
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Corporation"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => signupMutation.reset()}
                        {...register("companyName")}
                      />
                      {errors.companyName && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor="companyEmail"
                        className="text-sm font-medium"
                      >
                        Company Email *
                      </Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="contact@company.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => signupMutation.reset()}
                        {...register("companyEmail")}
                      />
                      {errors.companyEmail && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.companyEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Admin Account Section */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-100/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">
                      Admin Account
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="adminFirstName"
                        className="text-sm font-medium"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="adminFirstName"
                        type="text"
                        placeholder="John"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => signupMutation.reset()}
                        {...register("adminFirstName")}
                      />
                      {errors.adminFirstName && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.adminFirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="adminLastName"
                        className="text-sm font-medium"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="adminLastName"
                        type="text"
                        placeholder="Doe"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => signupMutation.reset()}
                        {...register("adminLastName")}
                      />
                      {errors.adminLastName && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.adminLastName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor="adminEmail"
                        className="text-sm font-medium"
                      >
                        <Mail className="h-3.5 w-3.5 inline mr-1" />
                        Admin Email *
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="john@company.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                        onFocus={() => signupMutation.reset()}
                        {...register("adminEmail")}
                      />
                      {errors.adminEmail && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.adminEmail.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        <Lock className="h-3.5 w-3.5 inline mr-1" />
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                          onFocus={() => signupMutation.reset()}
                          {...register("password")}
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
                      {errors.password && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-4 w-4" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="agreeToTerms"
                    onCheckedChange={(checked) =>
                      setValue("agreeToTerms", checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm font-normal cursor-pointer select-none leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:text-emerald-600 font-medium underline underline-offset-2"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:text-emerald-600 font-medium underline underline-offset-2"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-destructive flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4" />
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 h-10 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? (
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
                      Creating your workspace...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-emerald-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 py-1 text-muted-foreground font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="text-center">
                <Link
                  to="/login"
                  className="group text-sm font-medium text-primary hover:text-emerald-600 inline-flex items-center gap-1.5 transition-all duration-200"
                >
                  Sign in to your workspace
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
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
export default SignUp;
