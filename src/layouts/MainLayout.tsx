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
      <main className=" w-full h-full ">
      <Outlet />
      </main>
      </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default MainLayout;
