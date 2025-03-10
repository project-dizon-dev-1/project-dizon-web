import {
  SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full max-h-dvh">
        {/* Main content wrapper: Sidebar + Content */}
        <div className="flex h-full overflow-y-hidden">
          <AppSidebar />

          <SidebarInset className=" min-h-0 h-full border-l border-[#D1CDE9] bg-default">
            <Outlet />
          </SidebarInset>
        </div>
        {/* Footer remains at the bottom */}
        <div className=" flex items-center w-full min-h-[34px]">
          <p className="text-xs text-[#1C1D2180] leading-none ml-6">
            Developed by A2K Group Corporation
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
