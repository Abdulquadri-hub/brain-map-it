import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, GraduationCap } from "lucide-react";

interface Grade {
  id: string;
  name: string;
  subjects: string[];
}

interface AcademicStructureData {
  grades: Grade[];
  academicYear: string;
  termSystem: string;
}

interface AcademicStructureStepProps {
  data: AcademicStructureData;
  onUpdate: (updates: Partial<AcademicStructureData>) => void;
}

const commonSubjects = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "French",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Religious Studies",
  "Economics",
  "Literature",
];

const termSystems = [
  { value: "trimester", label: "Trimester (3 terms)" },
  { value: "semester", label: "Semester (2 terms)" },
  { value: "quarter", label: "Quarter (4 terms)" },
];

const AcademicStructureStep = ({ data, onUpdate }: AcademicStructureStepProps) => {
  const [newGradeName, setNewGradeName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");

  const addGrade = () => {
    if (!newGradeName.trim()) return;
    
    const newGrade: Grade = {
      id: Date.now().toString(),
      name: newGradeName.trim(),
      subjects: [],
    };
    
    onUpdate({ grades: [...data.grades, newGrade] });
    setNewGradeName("");
  };

  const removeGrade = (gradeId: string) => {
    onUpdate({ grades: data.grades.filter((g) => g.id !== gradeId) });
    if (selectedGrade === gradeId) {
      setSelectedGrade(null);
    }
  };

  const addSubjectToGrade = (gradeId: string, subject: string) => {
    if (!subject.trim()) return;
    
    onUpdate({
      grades: data.grades.map((g) =>
        g.id === gradeId && !g.subjects.includes(subject)
          ? { ...g, subjects: [...g.subjects, subject] }
          : g
      ),
    });
    setNewSubject("");
  };

  const removeSubjectFromGrade = (gradeId: string, subject: string) => {
    onUpdate({
      grades: data.grades.map((g) =>
        g.id === gradeId
          ? { ...g, subjects: g.subjects.filter((s) => s !== subject) }
          : g
      ),
    });
  };

  const selectedGradeData = data.grades.find((g) => g.id === selectedGrade);

  return (
    <div className="space-y-6">
      {/* Academic Year & Term System */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year *</Label>
          <Input
            id="academicYear"
            placeholder="e.g., 2024/2025"
            value={data.academicYear}
            onChange={(e) => onUpdate({ academicYear: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="termSystem">Term System *</Label>
          <Select
            value={data.termSystem}
            onValueChange={(value) => onUpdate({ termSystem: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term system" />
            </SelectTrigger>
            <SelectContent>
              {termSystems.map((system) => (
                <SelectItem key={system.value} value={system.value}>
                  {system.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grades Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Classes/Grades</Label>
          <p className="text-sm text-muted-foreground">
            Add your school's classes or grade levels
          </p>
        </div>

        {/* Add Grade */}
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Grade 1, JSS 1, Primary 1"
            value={newGradeName}
            onChange={(e) => setNewGradeName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGrade()}
          />
          <Button onClick={addGrade} className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Grade List */}
        {data.grades.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {data.grades.map((grade) => (
              <div
                key={grade.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedGrade === grade.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedGrade(grade.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="font-medium">{grade.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGrade(grade.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {grade.subjects.length} subject{grade.subjects.length !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No grades added yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first class or grade level above
            </p>
          </div>
        )}
      </div>

      {/* Subject Assignment */}
      {selectedGradeData && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <Label className="text-base font-semibold">
              Subjects for {selectedGradeData.name}
            </Label>
            <p className="text-sm text-muted-foreground">
              Select or add subjects taught in this grade
            </p>
          </div>

          {/* Quick Add Common Subjects */}
          <div className="flex flex-wrap gap-2">
            {commonSubjects
              .filter((s) => !selectedGradeData.subjects.includes(s))
              .slice(0, 8)
              .map((subject) => (
                <Badge
                  key={subject}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addSubjectToGrade(selectedGrade!, subject)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {subject}
                </Badge>
              ))}
          </div>

          {/* Custom Subject */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSubjectToGrade(selectedGrade!, newSubject);
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addSubjectToGrade(selectedGrade!, newSubject)}
            >
              Add
            </Button>
          </div>

          {/* Assigned Subjects */}
          {selectedGradeData.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedGradeData.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="gap-1">
                  {subject}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeSubjectFromGrade(selectedGrade!, subject)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcademicStructureStep;
