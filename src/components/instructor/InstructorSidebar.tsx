import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  UsersRound,
  ClipboardCheck,
  Video,
  Wallet,
  Briefcase,
  User,
  LogOut,
  GraduationCap,
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
  { title: "Hub", url: "/instructor", icon: LayoutDashboard },
  { title: "My Batches", url: "/instructor/batches", icon: UsersRound },
  { title: "Grading", url: "/instructor/grading", icon: ClipboardCheck },
  { title: "Live Sessions", url: "/instructor/sessions", icon: Video },
  { title: "Earnings", url: "/instructor/earnings", icon: Wallet },
];

const portalMenuItems = [
  { title: "Job Portal", url: "/instructor/applications", icon: Briefcase },
  { title: "My Profile", url: "/instructor/profile", icon: User },
];

const InstructorSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/instructor" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <GraduationCap className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="font-display font-bold text-foreground">Teach</span>
            <p className="text-xs text-muted-foreground">Instructor Hub</p>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teaching</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/instructor"}
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
          <SidebarGroupLabel>Career</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portalMenuItems.map((item) => (
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

export default InstructorSidebar;
