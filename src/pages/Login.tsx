import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, loginType } from "@/validations/authSchema";
import { login } from "@/services/authServices";
import { useNavigate } from "react-router";
import useUserContext from "@/hooks/useUserContext";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      userEmail: "",
      userPassword: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginType) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const userData = await login(data);
      setUser({
        id: userData.id,
        created_at: userData?.created_at,
        user_email: userData?.user_email,
        user_first_name: userData?.user_first_name,
        user_last_name: userData?.user_last_name,
        role: userData?.role,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login Failed", error);
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="rounded-md w-96 p-3 border border-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h1>Login</h1>

            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="JohnDoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="userPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            {errorMessage && (
              <div className="text-red-500 mb-2">{errorMessage}</div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
