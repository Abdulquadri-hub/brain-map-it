import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone,
  BookOpen,
  Eye,
  Pencil,
  Trash2,
  Download,
  Filter,
  Send
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  courses: number;
  students: number;
  status: "active" | "pending" | "inactive";
  joinDate: string;
}

const initialInstructors: Instructor[] = [
  { id: "1", name: "Dr. James Wilson", email: "james.wilson@email.com", phone: "+234 801 234 5678", department: "Mathematics", courses: 4, students: 120, status: "active", joinDate: "2023-01-15" },
  { id: "2", name: "Prof. Sarah Adams", email: "sarah.adams@email.com", phone: "+234 802 345 6789", department: "English", courses: 3, students: 95, status: "active", joinDate: "2023-02-20" },
  { id: "3", name: "Dr. Michael Chen", email: "michael.chen@email.com", phone: "+234 803 456 7890", department: "Science", courses: 5, students: 145, status: "active", joinDate: "2023-03-10" },
  { id: "4", name: "Prof. Emily Brown", email: "emily.brown@email.com", phone: "+234 804 567 8901", department: "History", courses: 2, students: 60, status: "pending", joinDate: "2024-11-05" },
  { id: "5", name: "Mr. David Lee", email: "david.lee@email.com", phone: "+234 805 678 9012", department: "Technology", courses: 3, students: 85, status: "active", joinDate: "2023-04-20" },
  { id: "6", name: "Ms. Lisa Garcia", email: "lisa.garcia@email.com", phone: "+234 806 789 0123", department: "Arts", courses: 2, students: 40, status: "inactive", joinDate: "2023-05-15" },
];

const departments = ["Mathematics", "English", "Science", "History", "Technology", "Arts"];

const InstructorsPage = () => {
  const [searchParams] = useSearchParams();
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || instructor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInstructor = () => {
    const instructor: Instructor = {
      id: Date.now().toString(),
      ...newInstructor,
      courses: 0,
      students: 0,
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setInstructors([...instructors, instructor]);
    setNewInstructor({ name: "", email: "", phone: "", department: "" });
    setIsAddDialogOpen(false);
    toast.success("Invitation sent to instructor!");
  };

  const handleEditInstructor = () => {
    if (!selectedInstructor) return;
    setInstructors(instructors.map((i) => (i.id === selectedInstructor.id ? selectedInstructor : i)));
    setIsEditDialogOpen(false);
    toast.success("Instructor updated successfully!");
  };

  const handleDeleteInstructor = () => {
    if (!selectedInstructor) return;
    setInstructors(instructors.filter((i) => i.id !== selectedInstructor.id));
    setIsDeleteDialogOpen(false);
    toast.success("Instructor removed successfully!");
  };

  const getStatusBadge = (status: Instructor["status"]) => {
    const variants = {
      active: "bg-primary/10 text-primary border-primary/20",
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      inactive: "bg-muted text-muted-foreground border-border",
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Instructors</h1>
          <p className="text-sm text-muted-foreground">Manage your teaching staff and assignments.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Instructor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Instructors", value: instructors.length, icon: GraduationCap },
          { label: "Active", value: instructors.filter((i) => i.status === "active").length, color: "text-primary" },
          { label: "Pending", value: instructors.filter((i) => i.status === "pending").length, color: "text-yellow-600" },
          { label: "Total Courses", value: instructors.reduce((acc, i) => acc + i.courses, 0), color: "text-secondary" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor, index) => (
          <motion.div
            key={instructor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {instructor.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{instructor.name}</h3>
                      <p className="text-sm text-muted-foreground">{instructor.department}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem onClick={() => { setSelectedInstructor(instructor); setIsViewDialogOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedInstructor(instructor); setIsEditDialogOpen(true); }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      {instructor.status === "pending" && (
                        <DropdownMenuItem onClick={() => toast.success("Reminder sent!")}>
                          <Send className="h-4 w-4 mr-2" /> Resend Invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => { setSelectedInstructor(instructor); setIsDeleteDialogOpen(true); }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{instructor.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{instructor.courses}</span>
                      <span className="text-muted-foreground">courses</span>
                    </div>
                  </div>
                  {getStatusBadge(instructor.status)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Invite Instructor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Instructor</DialogTitle>
            <DialogDescription>Send an invitation to join your school as an instructor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={newInstructor.name} 
                onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })} 
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={newInstructor.email} 
                onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })} 
                placeholder="instructor@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={newInstructor.phone} 
                onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })} 
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={newInstructor.department} onValueChange={(value) => setNewInstructor({ ...newInstructor, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddInstructor}>
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Instructor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instructor Profile</DialogTitle>
          </DialogHeader>
          {selectedInstructor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedInstructor.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedInstructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedInstructor.department}</p>
                  {getStatusBadge(selectedInstructor.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedInstructor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedInstructor.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="font-medium text-foreground">{selectedInstructor.courses}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium text-foreground">{selectedInstructor.students}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium text-foreground">{selectedInstructor.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Instructor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
            <DialogDescription>Update the instructor's information.</DialogDescription>
          </DialogHeader>
          {selectedInstructor && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={selectedInstructor.name} 
                  onChange={(e) => setSelectedInstructor({ ...selectedInstructor, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={selectedInstructor.email} 
                  onChange={(e) => setSelectedInstructor({ ...selectedInstructor, email: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                  value={selectedInstructor.department} 
                  onValueChange={(value) => setSelectedInstructor({ ...selectedInstructor, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={selectedInstructor.status} 
                  onValueChange={(value: Instructor["status"]) => setSelectedInstructor({ ...selectedInstructor, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditInstructor}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Instructor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedInstructor?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteInstructor}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsPage;
