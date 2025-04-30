import useUserContext from "@/hooks/useUserContext";
import { getHouse } from "@/services/houseServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { getInitial } from "@/lib/utils";
import EditProfileForm from "@/components/Profile/EditProfileForm";
import EditEmailForm from "@/components/Profile/EditEmailForm";
import { useEffect } from "react";
import { updateEmail } from "@/services/userServices";
import { supabase } from "@/services/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import DeleteAccountForm from "@/components/Profile/DeleteAccountForm";

const Profile = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => getHouse(user?.house_id),
    enabled: !!user,
  });

  const isEmailChangeConfirmation = location.hash.includes("type=email_change");

  const goToPasswordReset = () => {
    navigate("/password-recovery");
  };
  // Check if we have a valid session and handle email change if needed
  useEffect(() => {
    const checkSessionAndHandleEmailChange = async () => {
      const { data } = await supabase.auth.getUser();
      // Handle email change confirmation if present in URL
      if (isEmailChangeConfirmation && data.user) {
        await updateEmail({
          user_id: data.user.id,
          email: data.user.email || "",
        });

        toast({
          title: "Email Address Updated",
          description: "Your email has been successfully changed.",
        });

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ["user", data.user.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["profile", data.user.id],
        });
      }
    };

    checkSessionAndHandleEmailChange();
  }, [isEmailChangeConfirmation, user, queryClient]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 ">
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <Icon
              icon="mingcute:alert-circle-fill"
              className="h-12 w-12 text-amber-500 mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t load your profile information. Please try again
              later.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center"
            >
              <Icon icon="mingcute:refresh-1-line" className="mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${user?.user_first_name || ""} ${
    user?.user_last_name || ""
  }`.trim();
  const initials = getInitial(fullName);

  return (
    <div className="p-6 overflow-y-scroll no-scrollbar">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Personal Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icon icon="mingcute:user-3-line" className="mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">{user?.user_email}</p>
                {user?.role && (
                  <Badge className="mt-1" variant="outline">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Family Name</p>
                  <p className="font-medium">
                    {data.house_family_name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="font-medium">
                    {data.house_main_poc_user?.contact_number || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icon icon="mingcute:home-3-line" className="mr-2" />
            Residence Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Address details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-md flex items-center">
                  <Icon icon="mingcute:location-line" className="mr-1" />
                  Address
                </h3>
                <p className="text-muted-foreground mb-2">
                  Your residence location details
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Phase</p>
                    <p className="font-medium">{data.phases?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="font-medium">{data.blocks?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Street</p>
                    <p className="font-medium">{data.streets?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot</p>
                    <p className="font-medium">{data.lots?.name || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icon icon="mingcute:settings-3-line" className="mr-2" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <EditProfileForm
                houseData={{
                  user_id: user?.id,
                  first_name: data.house_main_poc_user?.user_first_name,
                  contact_number: data.house_main_poc_user?.contact_number,
                  last_name: data.house_main_poc_user?.user_last_name,
                }}
                houseId={user?.house_id}
              />

              <Button
                onClick={goToPasswordReset}
                variant="outline"
                className="flex items-center"
              >
                <Icon icon="mingcute:lock-line" className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <EditEmailForm />
              <DeleteAccountForm userId={user?.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
