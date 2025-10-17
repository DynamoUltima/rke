import { useState, useEffect } from "react";
import {
  Home,
  Building2,
  Users,
  UserCircle,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Header } from "./components/Header";
import { DashboardOverview } from "./components/DashboardOverview";
import { PropertiesPage } from "./components/PropertiesPage";
import { AgentsPage } from "./components/AgentsPage";
import { ClientsPage } from "./components/ClientsPage";
import { TransactionsPage } from "./components/TransactionsPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { DataInitializer } from "./components/DataInitializer";
import { AuthPage } from "./components/AuthPage";
import { getSession, AuthSession } from "./utils/auth";
import { Toaster } from "./components/ui/sonner";

const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Properties", icon: Building2, id: "properties" },
  { title: "Agents", icon: Users, id: "agents" },
  { title: "Clients", icon: UserCircle, id: "clients" },
  { title: "Transactions", icon: Receipt, id: "transactions" },
  { title: "Analytics", icon: BarChart3, id: "analytics" },
  { title: "Settings", icon: Settings, id: "settings" },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsCheckingAuth(true);
    try {
      const currentSession = await getSession();
      setSession(currentSession);
    } catch (error) {
      console.error("Error checking session:", error);
      setSession(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuthSuccess = () => {
    checkSession();
  };

  const handleLogout = () => {
    setSession(null);
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="size-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!session) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview />;
      case "properties":
        return <PropertiesPage />;
      case "agents":
        return <AgentsPage />;
      case "clients":
        return <ClientsPage />;
      case "transactions":
        return <TransactionsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <DataInitializer />
      <Toaster />
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-6">
                <div className="flex items-center gap-2">
                  <Building2 className="size-6" />
                  <span className="text-lg">
                    HomeSpace Admin
                  </span>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActivePage(item.id)}
                        isActive={activePage === item.id}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 flex items-center gap-2 bg-background px-4 py-2 border-b">
            <SidebarTrigger />
          </div>
          <Header 
            userName={session.user.name || "Admin"}
            userEmail={session.user.email}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-auto bg-muted/30">
            {renderPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}