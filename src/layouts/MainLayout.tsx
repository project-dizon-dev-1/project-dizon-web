import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";
import MobileNavigation from "@/components/MobileNavigation";

const MainLayout = () => {
  const { isMobile } = useSidebar();
  return (
    <div className="flex flex-col w-full max-h-dvh">
      {/* Main content wrapper: Sidebar + Content */}
      {isMobile && <MobileNavigation />}
      <div className="flex h-full overflow-y-hidden">
        <AppSidebar />

        <SidebarInset
          className={cn(
            " min-h-0 h-full border-l border-[#D1CDE9] bg-default py-9 px-12",
            { "p-1 overflow-y-scroll no-scrollbar": isMobile }
          )}
        >
          <Outlet />
        </SidebarInset>
      </div>
      {/* Footer remains at the bottom */}
      <div className=" flex items-center w-full min-h-[34px]">
        <p className="text-xs text-[#1C1D2180] leading-none ml-6">
          Developed by A2K Group Corporation © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default MainLayout;
