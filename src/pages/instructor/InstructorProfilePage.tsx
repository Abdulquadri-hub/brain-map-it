import { useState } from "react";
import { User, MapPin, Mail, Phone, BookOpen, GraduationCap, Award, Briefcase, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Mock profile data matching Dr. Sarah Johnson (inst-1)
const mockProfile = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+234 801 555 1234",
  location: "Lagos, Nigeria",
  bio: "Experienced mathematics and physics educator with over 10 years of teaching at secondary and tertiary levels. Passionate about making complex concepts accessible through interactive, real-world examples.",
  specializations: ["Mathematics", "Physics", "Further Mathematics"],
  academicLevels: ["JSS 1-3", "SSS 1-3"],
  experience: [
    { id: "exp-1", institution: "Bright Stars Academy", role: "Mathematics Instructor", subjects: ["Mathematics", "Further Mathematics"], startDate: "2022-01", isCurrent: true },
    { id: "exp-2", institution: "Lagos State University", role: "Adjunct Lecturer", subjects: ["Physics"], startDate: "2018-06", endDate: "2021-12", isCurrent: false },
  ],
  education: [
    { id: "edu-1", institution: "University of Lagos", degree: "Ph.D", field: "Applied Mathematics", graduationYear: 2018 },
    { id: "edu-2", institution: "University of Ibadan", degree: "M.Sc", field: "Physics", graduationYear: 2014 },
  ],
  certifications: [
    { id: "cert-1", name: "Certified Online Instructor", issuer: "National Teachers Institute", issueDate: "2023-03" },
  ],
  totalStudentsTaught: 450,
  totalBatchesCompleted: 28,
  averageRating: 4.8,
  reviewCount: 72,
  isProfilePublic: true,
  isOpenToOpportunities: true,
};

const InstructorProfilePage = () => {
  const [isPublic, setIsPublic] = useState(mockProfile.isProfilePublic);
  const [isOpen, setIsOpen] = useState(mockProfile.isOpenToOpportunities);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your public tutor profile</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      {/* Visibility Controls */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? <Eye className="h-5 w-5 text-emerald-600" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
              <div>
                <p className="font-medium text-foreground">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">
                  {isPublic ? "Your profile is visible on the marketplace" : "Your profile is hidden"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Open to Opportunities</p>
                <p className="text-sm text-muted-foreground">Schools can see you're looking for work</p>
              </div>
            </div>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Students Taught", value: mockProfile.totalStudentsTaught },
          { label: "Batches Completed", value: mockProfile.totalBatchesCompleted },
          { label: "Rating", value: `${mockProfile.averageRating}/5` },
          { label: "Reviews", value: mockProfile.reviewCount },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input defaultValue={mockProfile.name} /></div>
            <div><Label>Email</Label><Input defaultValue={mockProfile.email} type="email" /></div>
            <div><Label>Phone</Label><Input defaultValue={mockProfile.phone} /></div>
            <div><Label>Location</Label><Input defaultValue={mockProfile.location} /></div>
          </div>
          <div><Label>Bio</Label><Textarea defaultValue={mockProfile.bio} rows={4} /></div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {mockProfile.specializations.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Academic Levels: {mockProfile.academicLevels.join(", ")}</p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" /> Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockProfile.experience.map((exp) => (
            <div key={exp.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{exp.role}</p>
                <p className="text-sm text-muted-foreground">{exp.institution}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm">+ Add Experience</Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockProfile.education.map((edu) => (
            <div key={edu.id} className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium text-foreground">{edu.degree} in {edu.field}</p>
              <p className="text-sm text-muted-foreground">{edu.institution} • {edu.graduationYear}</p>
            </div>
          ))}
          <Button variant="outline" size="sm">+ Add Education</Button>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockProfile.certifications.map((cert) => (
            <div key={cert.id} className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium text-foreground">{cert.name}</p>
              <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.issueDate}</p>
            </div>
          ))}
          <Button variant="outline" size="sm">+ Add Certification</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfilePage;
