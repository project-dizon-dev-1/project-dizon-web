import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "@/services/supabaseClient";

const GuestRoute = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // show screen to update user's password
        navigate("/passord-recovery");
        return;
      }
    });
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // If user is  authenticated, redirect Home
          setAuthStatus({ loading: false, authenticated: true });
          navigate("/dashboard", { replace: true });
        } else {
          // If user is not authenticated, continue to the link
          setAuthStatus({ loading: false, authenticated: false });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthStatus({ loading: false, authenticated: false });
      }
    };

    checkSession();
  }, [navigate]);

  if (authStatus.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  //If user is authenticated it will return null and not render the Outlet
  if (authStatus.authenticated) {
    return null;
  }

  return <Outlet />;
};

export default GuestRoute;
