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
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
              // If user is  authenticated, redirect Home
          setAuthStatus({ loading: false, authenticated: true });
          navigate("/", { replace: true });
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
    return <div>Loading...</div>; 
  }
 //If user is authenticated it will return null and not render the Outlet
  if (authStatus.authenticated) {
    return null; 
  }

  return <Outlet />;
};

export default GuestRoute;
