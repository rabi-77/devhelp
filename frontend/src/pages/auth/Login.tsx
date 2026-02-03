import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginSchema, type LoginInput } from "../../validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";
import { getRedirectPath } from "@/utils/redirect";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/shared/Navbar";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}
const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      navigate(getRedirectPath(response.data.redirectTo), { replace: true });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
    retry: false,
  });
  const onSubmit = (data: LoginInput, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    loginMutation.mutate(data);
  };
  return (
    <>
      <Navbar variant="auth" authType="login" />
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                Sign in to access your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginMutation.isError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(loginMutation.error as ApiErrorResponse)?.response?.data
                      ?.error?.message || "Invalid email or password"}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                    onFocus={() => loginMutation.reset()}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                      onFocus={() => loginMutation.reset()}
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
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer select-none"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-emerald-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 h-10 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-emerald-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 py-1 text-muted-foreground font-medium">
                    New to devHelp?
                  </span>
                </div>
              </div>
              <div className="text-center">
                <Link
                  to="/signup"
                  className="group text-sm font-medium text-primary hover:text-emerald-600 inline-flex items-center gap-1.5 transition-all duration-200"
                >
                  Create a free account
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
export default Login;
