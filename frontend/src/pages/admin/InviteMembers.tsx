import { inviteApi } from "@/api/invite.api";
import { InviteInput, InviteSchema } from "@/validations/inviteSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  User,
  Send,
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
const InviteMembers = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteInput>({
    resolver: zodResolver(InviteSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });
  const inviteMutation = useMutation({
    mutationFn: (data: InviteInput) => inviteApi.inviteMember(data),
    onSuccess: (response, variables) => {
      console.log(response);
      setInvitedEmail(variables.email);
      setIsSuccess(true);
      reset();
    },
    onError: (error) => {
      console.error("Invite error:", error);
    },
    retry: false,
  });
  const onSubmit = (data: InviteInput) => {
    inviteMutation.mutate(data);
  };
  const handleInviteAnother = () => {
    setIsSuccess(false);
    inviteMutation.reset();
  };
  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/members")}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Team Members
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Invite Team Member</h1>
        <p className="text-gray-600 mt-1">
          Send an invitation to join your team
        </p>
      </div>
      {/* Form Card */}
      <Card className="border-purple-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <CardTitle className="text-2xl text-gray-900">
            {isSuccess ? "Invitation Sent!" : "Member Details"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "The invitation has been sent successfully"
              : "Enter the details of the person you want to invite"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isSuccess ? (
            <div className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">
                  Invitation sent successfully to{" "}
                  <span className="font-semibold">{invitedEmail}</span>
                </AlertDescription>
              </Alert>
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50/50 to-blue-50/50 border border-purple-100/30">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#562182] mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-900">
                      What happens next?
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      <li>
                        • The invitee will receive an email with an invitation
                        link
                      </li>
                      <li>• They'll have 7 days to accept the invitation</li>
                      <li>• Once accepted, they'll be added to your team</li>
                      <li>• You'll be notified when they join</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleInviteAnother}
                  className="flex-1 bg-gradient-to-r from-[#562182] to-purple-700 hover:from-purple-700 hover:to-[#562182]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invite Another Member
                </Button>
                <Button
                  onClick={() => navigate("/admin/members")}
                  variant="outline"
                  className="flex-1 border-purple-200 hover:bg-purple-50"
                >
                  Back to Team
                </Button>
              </div>
            </div>
          ) : (
            <>
              {inviteMutation.isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(inviteMutation.error as ApiErrorResponse)?.response?.data
                      ?.error?.message ||
                      "Failed to send invitation. Please try again."}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    <Mail className="h-3.5 w-3.5 inline mr-1" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                    onFocus={() => inviteMutation.reset()}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      <User className="h-3.5 w-3.5 inline mr-1" />
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                      onFocus={() => inviteMutation.reset()}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                        <AlertCircle className="h-4 w-4" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      <User className="h-3.5 w-3.5 inline mr-1" />
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                      onFocus={() => inviteMutation.reset()}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 mt-1.5">
                        <AlertCircle className="h-4 w-4" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Info Box */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The invited member will receive an
                    email with a link to join your team. They'll need to create
                    a password to complete their account setup.
                  </p>
                </div>
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 font-medium shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-200 bg-gradient-to-r from-[#562182] to-purple-700 hover:from-purple-700 hover:to-[#562182]"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? (
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
                      Sending invitation...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default InviteMembers;
