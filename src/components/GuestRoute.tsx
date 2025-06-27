import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "@/services/supabaseClient";
import useUserContext from "@/hooks/useUserContext";

const GuestRoute = () => {
  const { user } = useUserContext();
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
          if (user?.role === "admin" || user?.role === "resident") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/residents", { replace: true });
          }
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
