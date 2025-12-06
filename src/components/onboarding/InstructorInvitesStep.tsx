import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, UserPlus, Mail, Users } from "lucide-react";

interface Instructor {
  id: string;
  email: string;
  name: string;
  role: string;
  subjects: string[];
}

interface InstructorInvitesStepProps {
  data: Instructor[];
  onUpdate: (instructors: Instructor[]) => void;
}

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "head_teacher", label: "Head Teacher" },
  { value: "admin", label: "Administrator" },
  { value: "principal", label: "Principal" },
  { value: "counselor", label: "Counselor" },
  { value: "librarian", label: "Librarian" },
];

const commonSubjects = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "French",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
];

const InstructorInvitesStep = ({ data, onUpdate }: InstructorInvitesStepProps) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "",
    subjects: [] as string[],
  });
  const [selectedSubject, setSelectedSubject] = useState("");

  const addInstructor = () => {
    if (!formData.email || !formData.name || !formData.role) return;

    const newInstructor: Instructor = {
      id: Date.now().toString(),
      ...formData,
    };

    onUpdate([...data, newInstructor]);
    setFormData({ email: "", name: "", role: "", subjects: [] });
  };

  const removeInstructor = (id: string) => {
    onUpdate(data.filter((i) => i.id !== id));
  };

  const addSubject = () => {
    if (!selectedSubject || formData.subjects.includes(selectedSubject)) return;
    setFormData({ ...formData, subjects: [...formData.subjects, selectedSubject] });
    setSelectedSubject("");
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((s) => s !== subject),
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Instructor Form */}
      <div className="p-6 border rounded-xl bg-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Invite Instructor</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="instructorName">Full Name *</Label>
            <Input
              id="instructorName"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructorEmail">Email Address *</Label>
            <Input
              id="instructorEmail"
              type="email"
              placeholder="teacher@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="instructorRole">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subjects (Optional)</Label>
            <div className="flex gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add subject" />
                </SelectTrigger>
                <SelectContent>
                  {commonSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={addSubject}
                disabled={!selectedSubject}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {formData.subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="gap-1">
                {subject}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeSubject(subject)}
                />
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={addInstructor}
          disabled={!formData.email || !formData.name || !formData.role}
          className="w-full gap-2"
        >
          <Mail className="w-4 h-4" />
          Add to Invite List
        </Button>
      </div>

      {/* Instructor List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Invite List</Label>
          <Badge variant="outline">{data.length} instructor{data.length !== 1 ? "s" : ""}</Badge>
        </div>

        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{instructor.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {roles.find((r) => r.value === instructor.role)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{instructor.email}</p>
                  {instructor.subjects.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {instructor.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInstructor(instructor.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-muted-foreground">No instructors added yet</p>
            <p className="text-sm text-muted-foreground">
              Add instructors above to send them invites
            </p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Invitations will be sent via email after you complete the
          onboarding. Instructors can set their own passwords when they accept the invitation.
        </p>
      </div>
    </div>
  );
};

export default InstructorInvitesStep;
