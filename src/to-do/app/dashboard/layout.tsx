import AppSidebar from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="p-2 flex flex-col w-full">
        <div className="flex flex-row items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-6" />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
