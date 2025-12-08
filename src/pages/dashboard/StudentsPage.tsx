import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone,
  Eye,
  Pencil,
  Trash2,
  Download,
  Filter
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

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated";
  coursesEnrolled: number;
}

const initialStudents: Student[] = [
  { id: "1", name: "John Doe", email: "john.doe@email.com", phone: "+234 801 234 5678", grade: "Grade 10", enrollmentDate: "2024-01-15", status: "active", coursesEnrolled: 5 },
  { id: "2", name: "Jane Smith", email: "jane.smith@email.com", phone: "+234 802 345 6789", grade: "Grade 11", enrollmentDate: "2024-02-20", status: "active", coursesEnrolled: 6 },
  { id: "3", name: "Michael Johnson", email: "michael.j@email.com", phone: "+234 803 456 7890", grade: "Grade 9", enrollmentDate: "2024-03-10", status: "active", coursesEnrolled: 4 },
  { id: "4", name: "Emily Brown", email: "emily.b@email.com", phone: "+234 804 567 8901", grade: "Grade 12", enrollmentDate: "2023-09-05", status: "graduated", coursesEnrolled: 8 },
  { id: "5", name: "David Wilson", email: "david.w@email.com", phone: "+234 805 678 9012", grade: "Grade 10", enrollmentDate: "2024-01-20", status: "inactive", coursesEnrolled: 3 },
  { id: "6", name: "Sarah Davis", email: "sarah.d@email.com", phone: "+234 806 789 0123", grade: "Grade 11", enrollmentDate: "2024-02-15", status: "active", coursesEnrolled: 5 },
];

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "active",
      coursesEnrolled: 0,
    };
    setStudents([...students, student]);
    setNewStudent({ name: "", email: "", phone: "", grade: "" });
    setIsAddDialogOpen(false);
    toast.success("Student added successfully!");
  };

  const handleEditStudent = () => {
    if (!selectedStudent) return;
    setStudents(students.map((s) => (s.id === selectedStudent.id ? selectedStudent : s)));
    setIsEditDialogOpen(false);
    toast.success("Student updated successfully!");
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    setStudents(students.filter((s) => s.id !== selectedStudent.id));
    setIsDeleteDialogOpen(false);
    toast.success("Student deleted successfully!");
  };

  const getStatusBadge = (status: Student["status"]) => {
    const variants = {
      active: "bg-primary/10 text-primary border-primary/20",
      inactive: "bg-muted text-muted-foreground border-border",
      graduated: "bg-secondary/10 text-secondary border-secondary/20",
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">Manage your student enrollment and records.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, icon: Users },
          { label: "Active", value: students.filter((s) => s.status === "active").length, color: "text-primary" },
          { label: "Inactive", value: students.filter((s) => s.status === "inactive").length, color: "text-muted-foreground" },
          { label: "Graduated", value: students.filter((s) => s.status === "graduated").length, color: "text-secondary" },
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
                placeholder="Search students..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all students enrolled in your school.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Courses</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Enrolled</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{student.grade}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{student.coursesEnrolled}</td>
                    <td className="py-3 px-4">{getStatusBadge(student.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{student.enrollmentDate}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsViewDialogOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsEditDialogOpen(true); }}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedStudent(student); setIsDeleteDialogOpen(true); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the student's information below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={newStudent.name} 
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} 
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                value={newStudent.email} 
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} 
                placeholder="john@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={newStudent.phone} 
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} 
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={newStudent.grade} onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedStudent.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  {getStatusBadge(selectedStudent.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium text-foreground">{selectedStudent.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                  <p className="font-medium text-foreground">{selectedStudent.coursesEnrolled}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p className="font-medium text-foreground">{selectedStudent.enrollmentDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student's information.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={selectedStudent.name} 
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={selectedStudent.email} 
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={selectedStudent.phone} 
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={selectedStudent.status} 
                  onValueChange={(value: Student["status"]) => setSelectedStudent({ ...selectedStudent, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
