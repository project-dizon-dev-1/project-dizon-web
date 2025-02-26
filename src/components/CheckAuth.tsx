import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "@/services/supabaseClient";
import useUserContext from "@/hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/userServices";

const CheckAuth = () => {

  const DatabasePassword = import.meta.env.VITE_SUPABASE_PASSWORD!;

  const tokenString = localStorage.getItem(`sb-${DatabasePassword}-auth-token`);
  const token = tokenString ? JSON.parse(tokenString) : null;
  const navigate = useNavigate();

  const {setUser } = useUserContext();

  const {data} = useQuery({
    queryKey: ["user", token?.user?.id],
    queryFn: async () => getUser(token?.user?.id),
    enabled:!!token
  });
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    authenticated: false,

  });

  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
  
        if (session?.user) {
          setUser(data);
          setAuthStatus({ loading: false, authenticated: true });
        } else {
          setAuthStatus({ loading: false, authenticated: false });
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthStatus({ loading: false, authenticated: false });
        navigate("/login", { replace: true });
      }
    };
  
    checkSession();
  }, [navigate, data]);
  

  if (authStatus.loading) {
    return <div>Loading...</div>;
  }
  //If user is not authenticated it will return null and not render the Outlet
  if (!authStatus.authenticated) {
    return <p>Not authorized!</p>; 
  }

  return <Outlet />;
};

export default CheckAuth;
