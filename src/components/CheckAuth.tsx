import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { supabase } from "@/services/supabaseClient";
import useUserContext from "@/hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/userServices";
import { User } from "@/context/userContext";
import { AuthSession } from "@supabase/supabase-js";

const CheckAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserContext();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authData, setAuthData] = useState<AuthSession | null>(null);

  // First, check the session
  useEffect(() => {
    const checkSession = async () => {
      // Get the current session
      const { data: sessionData, error } = await supabase.auth.getSession();

      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          navigate("/reset-password", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      });

      if (error) {
        console.error("Error checking session:", error);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      if (!sessionData.session) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      // Set the auth data
      setAuthData(sessionData.session);
      setSessionChecked(true);
    };

    checkSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login", { replace: true });
      } else if (session) {
        setAuthData(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  // Fetch user data based on the auth session
  const { data, isSuccess } = useQuery({
    queryKey: ["user", authData?.user?.id],
    queryFn: async () => {
      if (!authData?.user?.id) return null;
      return await getUser(authData.user.id);
    },
    enabled: !!authData && sessionChecked,
  });

  // Then, set up user data once session is checked and data is loaded
  useEffect(() => {
    const setupUserData = async () => {
      // Only proceed if session is checked and user data is loaded
      if (!sessionChecked || !isSuccess || !data) return;

      try {
        const { data: main_poc } = await supabase
          .from("house-list")
          .select("id,phase_id")
          .eq("house_main_poc", data.id)
          .maybeSingle();

        const userData: User = {
          contact_number: data.contact_number || null,
          created_at: data.created_at || "",
          id: data.id || "",
          role: data.role,
          user_email: data.user_email || "",
          user_first_name: data.user_first_name || "",
          user_last_name: data.user_last_name || "",
          house_id: main_poc?.id || null,
          house_phase: main_poc?.phase_id,
        };

        setUser(userData);
      } catch (error) {
        console.error("Error fetching house data:", error);
        setUser({
          contact_number: data.contact_number || null,
          created_at: data.created_at || "",
          id: data.id || "",
          role: data.role,
          user_email: data.user_email || "",
          user_first_name: data.user_first_name || "",
          user_last_name: data.user_last_name || "",
          house_id: null,
          house_phase: null,
        });
      }
    };

    setupUserData();
  }, [data, isSuccess, setUser, sessionChecked]);

  return <Outlet />;
};

export default CheckAuth;
