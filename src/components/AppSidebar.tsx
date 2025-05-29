import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";
import useUserContext from "@/hooks/useUserContext";
import { logout } from "@/services/authServices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export const AppSidebar = () => {
  const { isMobile } = useSidebar();
  const { user, setUser } = useUserContext();
  const url = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-[#FCFCFC]/[0.76] h-full relative z-1">
      {/* Background images */}
      <img
        className="absolute blur-[100px] right-0 bottom-14 -z-10"
        src="/icons/vector1.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] left-0 top-44 -z-10 "
        src="/icons/vector2.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] left- bottom-0 z-[-9] "
        src="/icons/vector3.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] right-0 top-[30px] -z-10 "
        src="/icons/vector4.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] top-36 -z-10 "
        src="/icons/vector5.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] bottom-16 -z-10"
        src="/icons/vector6.svg"
        alt="an icon"
      />
      <img
        className="absolute blur-[100px] right-0 -z-10"
        src="/icons/vector7.svg"
        alt="an icon"
      />
      <Sidebar
        className={cn("bg-transparent w-[265px]", { hidden: isMobile })}
        variant="sidebar"
        collapsible="none"
      >
        <SidebarContent className="no-scrollbar">
          <SidebarGroup className="p-3">
            <img
              onClick={() => navigate("/")}
              className="p-0 cursor-pointer w-[110px] mx-auto mt-[10px] mb-[20px]"
              src="/icons/dizon.svg"
              alt="an icon"
            />

            <SidebarGroupContent>
              {!user ? (
                <SidebarMenu>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <SidebarMenu>
                  {/* Main navigation items */}
                  {SIDEBAR_LINKS[
                    user?.role === "admin" ? "admin" : "resident"
                  ].map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton className="space-y-[6px]" asChild>
                        <Link
                          className={cn(
                            "flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42]",
                            {
                              "bg-white/[0.42]": url.pathname.startsWith(
                                item.link
                              ),
                            }
                          )}
                          to={item.link}
                        >
                          <div className="flex gap-3 justify-center items-center">
                            <Icon className="w-5 h-5" icon={item.icon} />
                            <span
                              className={cn(
                                "text-[14px] font-medium text-default",
                                {
                                  "font-semibold": url.pathname.startsWith(
                                    item.link
                                  ),
                                }
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          {url.pathname.startsWith(item.link) && (
                            <div className="h-[6px] w-[6px] rounded-full bg-[#45495A]"></div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Finance section for admin */}
                  {user?.role === "admin" && (
                    <>
                      <div className="flex justify-center items-center relative p-y-3 px-[16px] overflow-hidden">
                        <Separator className="bg-[#45495A]/[.24]" />
                        <p className="text-xs bg-transparent px-[7px] text-[#45495A]/[.24]">
                          Finance
                        </p>
                        <Separator className="bg-[#45495A]/[.24]" />
                      </div>

                      {SIDEBAR_LINKS["finance"].map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuButton asChild>
                            <Link
                              className={cn(
                                "flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42]",
                                {
                                  "bg-white/[0.42]": url.pathname.startsWith(
                                    item.link
                                  ),
                                }
                              )}
                              to={item.link}
                            >
                              <div className="flex gap-3 justify-center items-center">
                                <Icon className="w-5 h-5" icon={item.icon} />
                                <span
                                  className={cn(
                                    "text-[14px] font-medium text-default",
                                    {
                                      "font-semibold": url.pathname.startsWith(
                                        item.link
                                      ),
                                    }
                                  )}
                                >
                                  {item.label}
                                </span>
                              </div>

                              {url.pathname.startsWith(item.link) && (
                                <div className="h-[6px] w-[6px] rounded-full bg-[#45495A]"></div>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </>
                  )}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-0">
          <SidebarMenu className="bg-white/[0.24] border-t border-[#CDD1E9]">
            <SidebarMenuItem className="py-[18px] px-6 hover:bg-white/[0.24]">
              {!user ? (
                <div className=" flex gap-5">
                  <Skeleton className="h-8 w-8 rounded-lg " />
                  <div>
                    <Skeleton className=" h-4 w-40 mb-1" />
                    <Skeleton className=" h-4 w-20" />
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="bg-white/[0.24] hover:bg-white/[0.24]"
                    asChild
                  >
                    <SidebarMenuButton className="py-[18px] hover:bg-white/[0.24]">
                      <Avatar className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                        <AvatarImage src={""} alt="profile picture" />
                        <AvatarFallback className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                          {user?.user_first_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[14px] font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                          {user?.user_first_name} {user?.user_last_name}
                        </p>
                        <p className="text-xs text-[#1C1D21]/[.75]">
                          {user?.role?.toLocaleUpperCase()}
                        </p>
                      </div>
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
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
                      <span className="text-sm font-medium text-gray-800">
                        Profile
                      </span>
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
                      <Icon
                        className="h-5 w-5 text-blue-300"
                        icon="mingcute:exit-line"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        Sign out
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};
