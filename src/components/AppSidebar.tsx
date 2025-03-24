import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";
import useUserContext from "@/hooks/useUserContext";
import { logout } from "@/services/authServices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const AppSidebar = () => {
  const { user } = useUserContext();
  const url = useLocation();
  const navigate = useNavigate();

  return (
    <div className=" bg-[#FCFCFC]/[0.76] h-full  relative z-1">
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
        className=" bg-transparent w-[265px] "
        variant="sidebar"
        collapsible="none"
      >
        <SidebarContent className="no-scrollbar">
          <SidebarGroup className=" p-3">
            {/* <SidebarGroupLabel> */}

            <img
              className=" p-0 w-[110px] mx-auto mt-[36px] mb-[41px]"
              src="/icons/dizon.svg"
              alt="an icon"
            />
            {/* </SidebarGroupLabel> */}

            <SidebarGroupContent className=" ">
              <SidebarMenu>
                {/* Collapsible Section */}

                {SIDEBAR_LINKS["admin"].map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton className=" space-y-[6px]" asChild>
                      <Link
                        className={cn(
                          " flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42] ",
                          {
                            "bg-white/[0.42]": url.pathname.startsWith(
                              item.link
                            ),
                          }
                        )}
                        to={item.link}
                      >
                        <div className=" flex gap-3 justify-center items-center">
                          <Icon className="w-5 h-5" icon={item.icon} />
                          <span
                            className={cn(
                              " text-[14px] font-medium text-default",
                              {
                                " font-semibold": url.pathname.startsWith(
                                  item.link
                                ),
                              }
                            )}
                          >
                            {item.label}
                          </span>
                        </div>
                        {url.pathname.startsWith(item.link) && (
                          <div className=" h-[6px] w-[6px] rounded-full bg-[#45495A]"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <div className=" flex justify-center items-center relative p-y-3 px-[16px] overflow-hidden">
                  <Separator className="  bg-[#45495A]/[.24] " />
                  <p className=" text-xs bg-transparent px-[7px] text-[#45495A]/[.24] ">
                    Finance
                  </p>
                  <Separator className="  bg-[#45495A]/[.24] " />
                </div>
                {SIDEBAR_LINKS["finance"].map((item) => (
                  <SidebarMenuSubItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        className={cn(
                          " flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42] ",
                          {
                            "bg-white/[0.42]": url.pathname.startsWith(
                              item.link
                            ),
                          }
                        )}
                        to={item.link}
                      >
                        <div className=" flex gap-3 justify-center items-center">
                          <Icon className="w-5 h-5" icon={item.icon} />
                          <span
                            className={cn(
                              " text-[14px] font-medium text-default",
                              {
                                " font-semibold": url.pathname.startsWith(
                                  item.link
                                ),
                              }
                            )}
                          >
                            {item.label}
                          </span>
                        </div>

                        {url.pathname.startsWith(item.link) && (
                          <div className=" h-[6px] w-[6px] rounded-full bg-[#45495A]"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                ))}
                {/* <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>Finance</SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible> */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-0">
          <SidebarMenu className="bg-white/[0.24] border-t border-[#CDD1E9] ">
            <SidebarMenuItem className=" py-[18px] px-6 hover:bg-white/[0.24]">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="  bg-white/[0.24] hover:bg-white/[0.24]"
                  asChild
                >
                  <SidebarMenuButton className="py-[18px]  hover:bg-white/[0.24]">
                    <Avatar className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                      <AvatarImage src={""} alt="profile picture" />
                      <AvatarFallback className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                        T
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[14px] font-semibold">
                        {user?.user_first_name} {user?.user_last_name}
                      </p>
                      <p className=" text-xs text-[#1C1D21]/[.75]">
                        {user?.role?.toLocaleUpperCase()}
                      </p>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-white rounded-md shadow-md p-1"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      logout(), navigate("/login");
                    }}
                    className=" hover:bg-zinc-300 rounded-md hover:cursor-pointer"
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};
