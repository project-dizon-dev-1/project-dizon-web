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
} from '@/components/ui/sidebar';
import { SIDEBAR_LINKS } from '@/constants/sidebarLinks';
import useUserContext from '@/hooks/useUserContext';
import { logout } from '@/services/authServices';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useVillageByAdmin } from '@/hooks/use-village-admin';

export const AppSidebar = () => {
  const { data: villageData, isLoading: villageLoading } = useVillageByAdmin();
  const { isMobile } = useSidebar();
  const { user, setUser } = useUserContext();
  const url = useLocation();
  const navigate = useNavigate();

  const getSidebarLinks = () => {
    if (!user) return [];
    if (user.role === 'superadmin') {
      const allLinks = [
        {
          label: 'Village Dashboard',
          link: '/village-dashboard',
          icon: 'mingcute:home-3-line',
        },
        ...SIDEBAR_LINKS.admin,
        ...SIDEBAR_LINKS.superadmin,
      ];

      return allLinks.filter(
        (link, index, self) =>
          index === self.findIndex((l) => l.link === link.link)
      );
    }
    return SIDEBAR_LINKS[user.role] || [];
  };

  const sidebarLinks = getSidebarLinks();

  const showVillageFeatures = !!villageData && !villageLoading;

  return (
    <div className="bg-[#FCFCFC]/[0.76] h-full relative z-1">
      {/* Background decorations */}
      <img
        className="absolute blur-[100px] right-0 bottom-14 -z-10"
        src="/icons/vector1.svg"
      />
      <img
        className="absolute blur-[100px] left-0 top-44 -z-10"
        src="/icons/vector2.svg"
      />
      <img
        className="absolute blur-[100px] right-0 top-[30px] -z-10"
        src="/icons/vector4.svg"
      />

      <Sidebar
        className={cn('bg-transparent w-[265px]', { hidden: isMobile })}
        variant="sidebar"
        collapsible="none"
      >
        <SidebarContent className="no-scrollbar">
          <SidebarGroup className="p-3">
            <div
              onClick={() => navigate('/')}
              className="p-0 cursor-pointer mx-auto mt-[10px] mb-[20px] text-center"
            >
              {villageLoading ? (
                <Skeleton className="h-7 w-40 mx-auto" />
              ) : villageData ? (
                <h2 className="text-xl font-bold text-[#45495A]">
                  {villageData.village_name}
                </h2>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <Icon icon="mdi:home-off-outline" className="w-8 h-8" />
                  <p className="text-sm">No village created yet</p>
                </div>
              )}
            </div>

            {/* --- Sidebar links or placeholder --- */}
            <SidebarGroupContent>
              {!user ? (
                <SidebarMenu>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : showVillageFeatures ? (
                <SidebarMenu>
                  {sidebarLinks.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton className="space-y-[6px]" asChild>
                        <Link
                          className={cn(
                            'flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42]',
                            {
                              'bg-white/[0.42]': url.pathname.startsWith(
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
                                'text-[14px] font-medium text-default',
                                {
                                  'font-semibold': url.pathname.startsWith(
                                    item.link
                                  ),
                                }
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          {url.pathname.startsWith(item.link) && (
                            <div className="h-[6px] w-[6px] rounded-full bg-[#45495A]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Finance Section */}
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <>
                      <div className="flex justify-center items-center relative p-y-3 px-[16px] overflow-hidden">
                        <Separator className="bg-[#45495A]/[.24]" />
                        <p className="text-xs bg-transparent px-[7px] text-[#45495A]/[.24]">
                          Finance
                        </p>
                        <Separator className="bg-[#45495A]/[.24]" />
                      </div>

                      {SIDEBAR_LINKS.finance.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuButton asChild>
                            <Link
                              className={cn(
                                'flex justify-between pl-5 py-3 pr-[14px] rounded-xl hover:bg-white/[0.42]',
                                {
                                  'bg-white/[0.42]': url.pathname.startsWith(
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
                                    'text-[14px] font-medium text-default',
                                    {
                                      'font-semibold': url.pathname.startsWith(
                                        item.link
                                      ),
                                    }
                                  )}
                                >
                                  {item.label}
                                </span>
                              </div>
                              {url.pathname.startsWith(item.link) && (
                                <div className="h-[6px] w-[6px] rounded-full bg-[#45495A]" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </>
                  )}
                </SidebarMenu>
              ) : (
                // No village yet → Show message and button
                <div className="flex flex-col items-center text-center mt-10 text-gray-500 space-y-3">
                  <Icon icon="mdi:village-outline" className="h-10 w-10" />
                  <p className="text-sm">
                    You don’t have a village yet. Create one to access all
                    features.
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* --- Keep Footer --- */}
        <SidebarFooter className="p-0">
          <SidebarMenu className="bg-white/[0.24] border-t border-[#CDD1E9]">
            <SidebarMenuItem className="py-[18px] px-6 hover:bg-white/[0.24]">
              {!user ? (
                <div className="flex gap-5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="py-[18px] hover:bg-white/[0.24]">
                      <Avatar className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                        <AvatarImage src={''} alt="profile picture" />
                        <AvatarFallback className="bg-blue-100 h-8 w-8 rounded-lg border-accent">
                          {user?.user_first_name?.[0] || 'U'}
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
                      onClick={() => navigate('/profile')}
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
                      onSelect={() => navigate('/send-feedback')}
                      className="flex items-center hover:cursor-pointer gap-2 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Icon
                        className="h-5 w-5 text-blue-300"
                        icon="mingcute:chat-1-line"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        Send feedback
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={async () => {
                        setUser(null);
                        await logout();
                        navigate('/login');
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
