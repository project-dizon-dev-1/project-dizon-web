import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";

const MainLayout = () => {

  return (
    <SidebarProvider>
    <div className=" flex h-dvh w-full">
    <AppSidebar />
  
      <SidebarInset className=" flex-1 overflow-x-scroll no-scrollbar">
      {/* <SidebarTrigger /> */}
      <main className="h-full">
      <Outlet />
      </main>
      </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default MainLayout;
