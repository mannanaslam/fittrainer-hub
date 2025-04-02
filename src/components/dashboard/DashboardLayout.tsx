
import { ReactNode } from "react";
import { Bell } from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="p-4 h-16 flex items-center border-b justify-between">
            <SidebarTrigger />
            
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">3</span>
              </button>
              <div className="relative rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
                T
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
