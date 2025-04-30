import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "@/services/supabaseClient";

const GuestRoute = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

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
          // If user is authenticated, redirect Home
          setAuthenticated(true);
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, [navigate]);

  // If user is authenticated it will return null and not render the Outlet
  if (authenticated) {
    return null;
  }

  // Always render the outlet without waiting for authentication check
  return <Outlet />;
};

export default GuestRoute;
