"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  CreditCard,
  WalletCards,
  Bell,
  Award,
  BadgeDollarSign,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Debts", url: "/dashboard/debts", icon: CreditCard },
  { title: "Repayment plans", url: "/dashboard/repayment-plan", icon: WalletCards },
  { title: "Reminders", url: "/dashboard/reminders", icon: Bell },
  { title: "Achievements", url: "/dashboard/achievements", icon: Award },
];

const AppSidebar = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // current URL path

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Find the best match for current path (longest prefix match)
  const activeItem = items
    .filter((item) => pathname?.startsWith(item.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <BadgeDollarSign />
                <span className="text-white font-bold">Debt Assistance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = activeItem?.title === item.title;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={isActive ? "bg-blue-600 rounded-md" : ""}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className={isActive ? "text-white" : ""} />
                        <span className={isActive ? "text-white font-semibold" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
