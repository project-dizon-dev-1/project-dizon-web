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
import { loginSchema, loginType } from "@/validations/userSchema";
import { login } from "@/services/authServices";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import PasswordInput from "@/components/PasswordInput";
import BackGroundImage from "@/assets/BG.webp";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const form = useForm({
    defaultValues: {
      userEmail: "",
      userPassword: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: loginType) => login(data),
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      form.setError("root", {
        message: error.message,
      });
    },
  });

  const onSubmit = (data: loginType) => {
    loginMutation.mutate({
      userEmail: data.userEmail,
      userPassword: data.userPassword,
    });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white w-full overflow-y-scroll no-scrollbar">
      {/* Add Home Navigation Link */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <Icon icon={"mingcute:arrow-left-line"} className="w-4 h-4" />
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src={BackGroundImage}
            alt="background image"
          />
        </div>
      )}
      <div
        className={cn("w-full space-y-6 z-50 bg-white p-8 rounded-xl ", {
          "relative mx-auto max-w-md md:absolute md:bottom-12 md:right-32 md:mx-0 shadow-lg":
            !isMobile,
          "mx-auto max-w-md": isMobile,
        })}
      >
        <div className="flex flex-col items-center space-y-2">
          {/* <Icon
            className="text-center w-14 h-14"
            icon={"mingcute:attachment-line"}
          /> */}
          <h1 className="text-5xl font-medium tracking-tight text-primary-blue">
            GEMS
          </h1>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Login to your account
          </h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="JohnDoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="mb-1"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                {form.formState.errors.root.message}
              </div>
            )}

            <Link
              className=" text-sm hover:underline hover:text-blue-700"
              to={"/reset-password"}
            >
              Forgot Password?
            </Link>

            <div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full pb-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
