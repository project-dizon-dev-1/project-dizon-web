import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { supabase } from "@/services/supabaseClient";
import useUserContext from "@/hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/userServices";
import { User } from "@/context/userContext";

const CheckAuth = () => {
  // Get auth token from localStorage
  const DatabasePassword = import.meta.env.VITE_SUPABASE_PASSWORD!;
  const tokenString = localStorage.getItem(`sb-${DatabasePassword}-auth-token`);
  const auth = tokenString ? JSON.parse(tokenString) : null;

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserContext();
  const [sessionChecked, setSessionChecked] = useState(false);

  // Fetch user data based on the auth token
  const { data, isSuccess } = useQuery({
    queryKey: ["user", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return null;
      return getUser(auth.user.id);
    },
    enabled: !!auth && sessionChecked,
  });

  // First, check the session
  useEffect(() => {
    const checkSession = async () => {
      // Listen for auth state changes

      // Normal session check
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session && !auth) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      // Mark session check as complete
      setSessionChecked(true);
    };

    checkSession();
  }, [navigate, location, auth]);

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
          .single();

        const userData: User = {
          contact_number: data.contact_number || null,
          created_at: data.created_at || "",
          id: data.id || "",
          role: data.role || null,
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
          role: data.role || null,
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
