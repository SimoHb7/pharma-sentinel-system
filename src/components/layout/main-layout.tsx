
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";

export default function MainLayout() {
  const isMobile = useMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
              <Outlet />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
