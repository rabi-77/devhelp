import { useAuthStore } from "@/store/authStore";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  acceptInviteInput,
  acceptInviteSchema,
} from "@/validations/inviteSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { inviteApi } from "@/api/invite.api";
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
import {
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  Building2,
  UserCheck,
  Loader2,
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
const AcceptInvite = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [invitationData, setInvitationData] = useState<any>(null);
  const tokenFromUrl = searchParams.get("token") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<acceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: tokenFromUrl,
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });
  const password = watch("password");
  const agreeToTerms = watch("agreeToTerms");
  useEffect(() => {
    setPasswordValue(password || "");
  }, [password]);
  useEffect(() => {
    if (tokenFromUrl) {
      setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, setValue]);
  const verifyMutation = useMutation({
    mutationFn: (token: string) => inviteApi.validateInvite(token),
    onSuccess: (response) => {
      setInvitationData(response.data);
    },
    onError: (error) => {
      console.error("Validation Error:", error);
    },
    retry: false,
  });
  useEffect(() => {
    if (tokenFromUrl) {
      verifyMutation.mutate(tokenFromUrl);
    }
  }, [tokenFromUrl]);
  const acceptInviteMutation = useMutation({
    mutationFn: (data: acceptInviteInput) => inviteApi.acceptInvite(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      navigate(getRedirectPath(response.data.redirectTo), { replace: true });
    },
    onError: (error) => {
      console.error("Accept Invite error:", error);
    },
    retry: false,
  });
  const onSubmit = (
    data: acceptInviteInput,
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();
    acceptInviteMutation.mutate(data);
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
                Invalid Invitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This invitation link is invalid or missing. Please check your
                  email for the correct link.
                </AlertDescription>
              </Alert>
              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (verifyMutation.isPending) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#562182] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your invitation...</p>
        </div>
      </div>
    );
  }
  if (verifyMutation.isError) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-3 pt-4">
              <div className="flex justify-center">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Invitation Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(verifyMutation.error as ApiErrorResponse)?.response?.data
                    ?.error?.message ||
                    "This invitation is invalid, expired, or has already been used."}
                </AlertDescription>
              </Alert>
              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border border-emerald-100/50 shadow-2xl shadow-emerald-100/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-3 pt-4">
            <div className="flex justify-center">
              <Logo size="lg" showText={true} />
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Accept Invitation
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              Complete your account setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitationData && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-emerald-50/50 to-blue-50/50 border border-emerald-100/30">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[#562182]" />
                    <span className="font-medium text-gray-900">
                      {invitationData.firstName} {invitationData.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#562182]" />
                    <span className="text-gray-600">
                      {invitationData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#562182]" />
                    <span className="text-gray-600">
                      {invitationData.company.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {acceptInviteMutation.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(acceptInviteMutation.error as ApiErrorResponse)?.response
                    ?.data?.error?.message ||
                    "Failed to accept invitation. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("token")} />
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  <Lock className="h-3.5 w-3.5 inline mr-1" />
                  Create Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-200"
                    onFocus={() => acceptInviteMutation.reset()}
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
                    onFocus={() => acceptInviteMutation.reset()}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/30">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setValue("agreeToTerms", checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-emerald-600 font-medium underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-emerald-600 font-medium underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-4 h-11 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary"
                disabled={acceptInviteMutation.isPending}
              >
                {acceptInviteMutation.isPending ? (
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
                    Activating your account...
                  </span>
                ) : (
                  "Accept Invitation & Join Team"
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
                className="text-sm font-medium text-primary hover:text-emerald-600 transition-colors duration-200"
              >
                Sign in instead
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
          © 2026 devHelp. All rights reserved.
        </p>
      </div>
    </div>
  );
};
export default AcceptInvite;
