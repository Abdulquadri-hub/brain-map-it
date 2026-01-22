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
  Send,
  DollarSign,
  Percent,
  Banknote
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
import PaymentStructureSelector from "@/components/instructors/PaymentStructureSelector";
import PermissionsSelector from "@/components/instructors/PermissionsSelector";
import { 
  Instructor, 
  InstructorInvitation,
  PaymentTerms,
  InstructorPermission,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_PERMISSIONS
} from "@/types/instructor";

/**
 * InstructorsPage - Manage school instructors
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive instructors, courses from InstructorController@index
 * - Use router.post('/instructors/invite', data) to send invitations
 * - Use router.put('/instructors/{id}', data) to update
 * - Use router.delete('/instructors/{id}') to remove
 */

// Extended instructor interface for local state
interface InstructorWithPayment extends Omit<Instructor, 'userId' | 'specializations' | 'schoolAssociations'> {
  paymentStructure?: PaymentTerms;
  permissions?: InstructorPermission[];
  earnings?: {
    thisMonth: number;
    total: number;
  };
}

const initialInstructors: InstructorWithPayment[] = [
  { 
    id: "1", 
    name: "Dr. James Wilson", 
    email: "james.wilson@email.com", 
    phone: "+234 801 234 5678", 
    department: "Mathematics", 
    courses: 4, 
    students: 120, 
    status: "active", 
    joinDate: "2023-01-15",
    paymentStructure: { structure: 'revenue_share', revenueSharePercentage: 30 },
    permissions: ['upload_content', 'host_live_sessions', 'grade_assignments', 'view_analytics'],
    earnings: { thisMonth: 125000, total: 1450000 }
  },
  { 
    id: "2", 
    name: "Prof. Sarah Adams", 
    email: "sarah.adams@email.com", 
    phone: "+234 802 345 6789", 
    department: "English", 
    courses: 3, 
    students: 95, 
    status: "active", 
    joinDate: "2023-02-20",
    paymentStructure: { structure: 'fixed_salary', fixedSalaryAmount: 150000, salaryFrequency: 'monthly' },
    permissions: ['upload_content', 'grade_assignments', 'view_analytics'],
    earnings: { thisMonth: 150000, total: 1800000 }
  },
  { 
    id: "3", 
    name: "Dr. Michael Chen", 
    email: "michael.chen@email.com", 
    phone: "+234 803 456 7890", 
    department: "Science", 
    courses: 5, 
    students: 145, 
    status: "active", 
    joinDate: "2023-03-10",
    paymentStructure: { structure: 'base_commission', baseSalaryAmount: 80000, commissionPercentage: 20 },
    permissions: ['upload_content', 'host_live_sessions', 'grade_assignments', 'manage_enrollments', 'view_analytics'],
    earnings: { thisMonth: 180000, total: 2100000 }
  },
  { 
    id: "4", 
    name: "Prof. Emily Brown", 
    email: "emily.brown@email.com", 
    phone: "+234 804 567 8901", 
    department: "History", 
    courses: 2, 
    students: 60, 
    status: "pending", 
    joinDate: "2024-11-05",
    paymentStructure: { structure: 'revenue_share', revenueSharePercentage: 25 },
    permissions: ['upload_content', 'grade_assignments'],
  },
  { 
    id: "5", 
    name: "Mr. David Lee", 
    email: "david.lee@email.com", 
    phone: "+234 805 678 9012", 
    department: "Technology", 
    courses: 3, 
    students: 85, 
    status: "active", 
    joinDate: "2023-04-20",
    paymentStructure: { structure: 'revenue_share', revenueSharePercentage: 35 },
    permissions: ['upload_content', 'host_live_sessions', 'grade_assignments', 'view_analytics', 'message_students'],
    earnings: { thisMonth: 95000, total: 890000 }
  },
  { 
    id: "6", 
    name: "Ms. Lisa Garcia", 
    email: "lisa.garcia@email.com", 
    phone: "+234 806 789 0123", 
    department: "Arts", 
    courses: 2, 
    students: 40, 
    status: "inactive", 
    joinDate: "2023-05-15",
    paymentStructure: { structure: 'fixed_salary', fixedSalaryAmount: 100000, salaryFrequency: 'monthly' },
    permissions: ['upload_content', 'grade_assignments'],
  },
];

const departments = ["Mathematics", "English", "Science", "History", "Technology", "Arts"];

// Mock courses for assignment
const availableCourses = [
  { id: "c1", name: "Advanced Mathematics", level: "SSS 2" },
  { id: "c2", name: "English Literature", level: "SSS 1" },
  { id: "c3", name: "Physics Fundamentals", level: "SSS 2" },
  { id: "c4", name: "Introduction to Coding", level: "JSS 3" },
  { id: "c5", name: "African History", level: "SSS 1" },
  { id: "c6", name: "Creative Arts", level: "Primary 6" },
];

const InstructorsPage = () => {
  const [searchParams] = useSearchParams();
  const [instructors, setInstructors] = useState<InstructorWithPayment[]>(initialInstructors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorWithPayment | null>(null);
  const [inviteStep, setInviteStep] = useState<'details' | 'payment' | 'permissions'>('details');
  
  // New instructor invitation form state
  const [newInstructor, setNewInstructor] = useState<InstructorInvitation>({
    name: "",
    email: "",
    phone: "",
    department: "",
    paymentTerms: DEFAULT_PAYMENT_TERMS,
    permissions: DEFAULT_PERMISSIONS,
    assignedCourses: [],
    message: "",
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
    const instructor: InstructorWithPayment = {
      id: Date.now().toString(),
      name: newInstructor.name,
      email: newInstructor.email,
      phone: newInstructor.phone,
      department: newInstructor.department,
      courses: newInstructor.assignedCourses.length,
      students: 0,
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      paymentStructure: newInstructor.paymentTerms,
      permissions: newInstructor.permissions,
    };
    setInstructors([...instructors, instructor]);
    setNewInstructor({
      name: "",
      email: "",
      phone: "",
      department: "",
      paymentTerms: DEFAULT_PAYMENT_TERMS,
      permissions: DEFAULT_PERMISSIONS,
      assignedCourses: [],
      message: "",
    });
    setInviteStep('details');
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

  const getStatusBadge = (status: InstructorWithPayment["status"]) => {
    const variants = {
      active: "bg-primary/10 text-primary border-primary/20",
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      inactive: "bg-muted text-muted-foreground border-border",
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  const getPaymentBadge = (structure?: PaymentTerms) => {
    if (!structure) return null;
    
    const config = {
      revenue_share: { label: `${structure.revenueSharePercentage}% Share`, icon: Percent, color: "text-primary" },
      fixed_salary: { label: `₦${(structure.fixedSalaryAmount || 0).toLocaleString()}/${structure.salaryFrequency?.slice(0, 2)}`, icon: Banknote, color: "text-secondary" },
      base_commission: { label: `Base + ${structure.commissionPercentage}%`, icon: DollarSign, color: "text-accent-foreground" },
    };
    
    const { label, icon: Icon, color } = config[structure.structure];
    
    return (
      <Badge variant="outline" className="text-xs gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </Badge>
    );
  };

  const toggleCourseAssignment = (courseId: string) => {
    setNewInstructor(prev => ({
      ...prev,
      assignedCourses: prev.assignedCourses.includes(courseId)
        ? prev.assignedCourses.filter(id => id !== courseId)
        : [...prev.assignedCourses, courseId]
    }));
  };

  const isDetailsValid = newInstructor.name && newInstructor.email && newInstructor.department;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Instructors</h1>
          <p className="text-sm text-muted-foreground">Manage your teaching staff, assignments, and compensation.</p>
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
          { label: "Total Payout (This Month)", value: `₦${instructors.reduce((acc, i) => acc + (i.earnings?.thisMonth || 0), 0).toLocaleString()}`, color: "text-secondary" },
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

                {/* Payment & Earnings */}
                {instructor.paymentStructure && (
                  <div className="flex items-center justify-between py-2 mb-2 border-y border-border">
                    {getPaymentBadge(instructor.paymentStructure)}
                    {instructor.earnings && (
                      <span className="text-sm font-medium text-primary">
                        ₦{instructor.earnings.thisMonth.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
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

      {/* Enhanced Invite Instructor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) setInviteStep('details');
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Invite Instructor</DialogTitle>
            <DialogDescription>
              {inviteStep === 'details' && "Enter the instructor's basic information."}
              {inviteStep === 'payment' && "Configure how this instructor will be compensated."}
              {inviteStep === 'permissions' && "Set permissions and assign courses."}
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            {['details', 'payment', 'permissions'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  inviteStep === step 
                    ? 'bg-primary text-primary-foreground' 
                    : index < ['details', 'payment', 'permissions'].indexOf(inviteStep)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 ${
                    index < ['details', 'payment', 'permissions'].indexOf(inviteStep)
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <ScrollArea className="max-h-[60vh] pr-4">
            {/* Step 1: Basic Details */}
            {inviteStep === 'details' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    value={newInstructor.name} 
                    onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })} 
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
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
                  <Label>Department *</Label>
                  <Select 
                    value={newInstructor.department} 
                    onValueChange={(value) => setNewInstructor({ ...newInstructor, department: value })}
                  >
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
            )}

            {/* Step 2: Payment Structure */}
            {inviteStep === 'payment' && (
              <div className="py-4">
                <PaymentStructureSelector
                  value={newInstructor.paymentTerms}
                  onChange={(terms) => setNewInstructor({ ...newInstructor, paymentTerms: terms })}
                />
              </div>
            )}

            {/* Step 3: Permissions & Course Assignment */}
            {inviteStep === 'permissions' && (
              <div className="space-y-6 py-4">
                <PermissionsSelector
                  value={newInstructor.permissions}
                  onChange={(permissions) => setNewInstructor({ ...newInstructor, permissions })}
                />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Assign Courses (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Select courses this instructor will teach. You can assign more later.
                  </p>
                  <div className="grid gap-2">
                    {availableCourses.map((course) => (
                      <label
                        key={course.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          newInstructor.assignedCourses.includes(course.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Checkbox
                          checked={newInstructor.assignedCourses.includes(course.id)}
                          onCheckedChange={() => toggleCourseAssignment(course.id)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.level}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {inviteStep !== 'details' && (
              <Button 
                variant="outline" 
                onClick={() => setInviteStep(inviteStep === 'permissions' ? 'payment' : 'details')}
              >
                Back
              </Button>
            )}
            {inviteStep === 'details' && (
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            )}
            
            {inviteStep === 'details' && (
              <Button 
                onClick={() => setInviteStep('payment')}
                disabled={!isDetailsValid}
              >
                Next: Payment Structure
              </Button>
            )}
            {inviteStep === 'payment' && (
              <Button onClick={() => setInviteStep('permissions')}>
                Next: Permissions
              </Button>
            )}
            {inviteStep === 'permissions' && (
              <Button onClick={handleAddInstructor}>
                <Send className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Instructor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Instructor Profile</DialogTitle>
          </DialogHeader>
          {selectedInstructor && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="permissions">Access</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 py-4">
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
              </TabsContent>

              <TabsContent value="payment" className="space-y-4 py-4">
                {selectedInstructor.paymentStructure && (
                  <>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Payment Structure</p>
                      <div className="flex items-center gap-2">
                        {getPaymentBadge(selectedInstructor.paymentStructure)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedInstructor.paymentStructure.structure === 'revenue_share' && 
                          `Earns ${selectedInstructor.paymentStructure.revenueSharePercentage}% of course revenue`}
                        {selectedInstructor.paymentStructure.structure === 'fixed_salary' && 
                          `Fixed ₦${selectedInstructor.paymentStructure.fixedSalaryAmount?.toLocaleString()} ${selectedInstructor.paymentStructure.salaryFrequency}`}
                        {selectedInstructor.paymentStructure.structure === 'base_commission' && 
                          `₦${selectedInstructor.paymentStructure.baseSalaryAmount?.toLocaleString()}/month + ${selectedInstructor.paymentStructure.commissionPercentage}% commission`}
                      </p>
                    </div>
                    
                    {selectedInstructor.earnings && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-border">
                          <p className="text-sm text-muted-foreground">This Month</p>
                          <p className="text-xl font-bold text-primary">
                            ₦{selectedInstructor.earnings.thisMonth.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border border-border">
                          <p className="text-sm text-muted-foreground">Total Earnings</p>
                          <p className="text-xl font-bold text-foreground">
                            ₦{selectedInstructor.earnings.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4 py-4">
                {selectedInstructor.permissions && selectedInstructor.permissions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedInstructor.permissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="capitalize text-foreground">
                          {permission.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No permissions assigned</p>
                )}
              </TabsContent>
            </Tabs>
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
                  onValueChange={(value: InstructorWithPayment["status"]) => setSelectedInstructor({ ...selectedInstructor, status: value })}
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
