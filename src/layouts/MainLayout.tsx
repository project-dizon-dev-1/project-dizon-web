import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";

const MainLayout = () => {

  return (
    <SidebarProvider>
    <div className=" w-full flex h-dvh">
    <AppSidebar />
  
      <SidebarInset>
      {/* <SidebarTrigger /> */}
      <main className=" flex-1 flex">
      <Outlet />
      </main>
      </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default MainLayout;
