import useUserContext from "@/hooks/useUserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import { logout } from "@/services/authServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";

const MobileHeader = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between p-5 pb-3">
      <img
        className=" h-10"
        src="icons/dizon-logo-mobile.svg"
        alt="subdivision logo"
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          className="bg-white/[0.24] hover:bg-white/[0.24]"
          asChild
        >
          <Avatar className="bg-blue-100 h-8 w-8 rounded-full border-accent">
            <AvatarImage src={""} alt="profile picture" />
            <AvatarFallback className="bg-blue-100 h-8 w-8 rounded-rounded-full border-accent">
              {user?.user_first_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width] bg-white rounded-lg shadow-lg p-2"
        >
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Icon
              className="h-5 w-5 text-blue-300"
              icon="mingcute:user-2-line"
            />
            <span className="text-sm font-medium text-gray-800">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => navigate("/send-feedback")}
            className="flex items-center hover:cursor-pointer gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Icon
              className="h-5 w-5 text-blue-300"
              icon="mingcute:chat-1-line"
            />
            <span className="text-sm font-medium text-gray-800">
              Send a feedback
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              setUser(null);
              await logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Icon className="h-5 w-5 text-blue-300" icon="mingcute:exit-line" />
            <span className="text-sm font-medium text-gray-800">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileHeader;
