import useUserContext from "@/hooks/useUserContext";
import { Icon } from "@iconify/react";
import { Link, Outlet } from "react-router";
import Loading from "./Loading";

const AuthorizeByRole = ({ roles }: { roles: string[] }) => {
  const { user } = useUserContext();

  if (!user || !user.role) {
    return <Loading />;
  }

  if (roles && user?.role && roles.includes(user.role)) {
    return <Outlet />;
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-6 ">
        <Icon
          icon="mingcute:shield-alert-line"
          className="w-24 h-24 text-red-500 mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sorry, you do not have the necessary permissions to view this page.
          Please contact an administrator if you believe this is an error.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }
};

export default AuthorizeByRole;
