import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Video,
  BarChart3, 
  Settings,
  LogOut,
  School,
  UsersRound
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Batches", url: "/dashboard/batches", icon: UsersRound },
  { title: "Students", url: "/dashboard/students", icon: Users },
  { title: "Instructors", url: "/dashboard/instructors", icon: GraduationCap },
  { title: "Live Sessions", url: "/dashboard/live-sessions", icon: Video },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
];

const settingsMenuItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <School className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="font-display font-bold text-foreground">EduConnect</span>
            <p className="text-xs text-muted-foreground">School Portal</p>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <NavLink to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
