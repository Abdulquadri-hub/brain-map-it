import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  ClipboardList,
  MoreHorizontal,
  Pencil,
  Copy,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Module, Lesson, LessonType } from "@/types/course";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// 
// For saving modules:
// router.post(`/dashboard/courses/${courseId}/modules`, moduleData)
// router.put(`/dashboard/courses/${courseId}/modules/${moduleId}`, moduleData)
// router.delete(`/dashboard/courses/${courseId}/modules/${moduleId}`)

interface ModuleEditorProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
  courseId: string;
}

const lessonTypeIcons: Record<LessonType, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  quiz: <HelpCircle className="h-4 w-4" />,
  assignment: <ClipboardList className="h-4 w-4" />,
};

const lessonTypeLabels: Record<LessonType, string> = {
  video: "Video",
  document: "Document",
  quiz: "Quiz",
  assignment: "Assignment",
};

const ModuleEditor = ({ modules, onModulesChange, courseId }: ModuleEditorProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: "",
    description: "",
    type: "video",
    duration: "",
    isFree: false,
  });

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAddModule = () => {
    const module: Module = {
      id: `module-${Date.now()}`,
      courseId,
      title: newModule.title,
      description: newModule.description,
      lessons: [],
      order: modules.length,
    };
    onModulesChange([...modules, module]);
    setExpandedModules(new Set([...expandedModules, module.id]));
    setNewModule({ title: "", description: "" });
    setIsAddModuleOpen(false);
  };

  const handleEditModule = () => {
    if (!selectedModule) return;
    onModulesChange(
      modules.map((m) =>
        m.id === selectedModule.id
          ? { ...m, title: newModule.title, description: newModule.description }
          : m
      )
    );
    setIsEditModuleOpen(false);
    setSelectedModule(null);
    setNewModule({ title: "", description: "" });
  };

  const handleDeleteModule = (moduleId: string) => {
    onModulesChange(modules.filter((m) => m.id !== moduleId));
  };

  const handleAddLesson = () => {
    if (!selectedModule) return;
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: selectedModule.id,
      title: newLesson.title || "",
      description: newLesson.description,
      type: newLesson.type as LessonType || "video",
      duration: newLesson.duration || "",
      order: selectedModule.lessons.length,
      status: "draft",
      isFree: newLesson.isFree,
    };
    onModulesChange(
      modules.map((m) =>
        m.id === selectedModule.id
          ? { ...m, lessons: [...m.lessons, lesson] }
          : m
      )
    );
    setNewLesson({ title: "", description: "", type: "video", duration: "", isFree: false });
    setIsAddLessonOpen(false);
  };

  const handleEditLesson = () => {
    if (!selectedLesson || !selectedModule) return;
    onModulesChange(
      modules.map((m) =>
        m.id === selectedModule.id
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === selectedLesson.id
                  ? { ...l, ...newLesson }
                  : l
              ),
            }
          : m
      )
    );
    setIsEditLessonOpen(false);
    setSelectedLesson(null);
    setNewLesson({ title: "", description: "", type: "video", duration: "", isFree: false });
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const handleReorderModules = (newOrder: Module[]) => {
    onModulesChange(newOrder.map((m, i) => ({ ...m, order: i })));
  };

  const handleReorderLessons = (moduleId: string, newLessons: Lesson[]) => {
    onModulesChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: newLessons.map((l, i) => ({ ...l, order: i })) }
          : m
      )
    );
  };

  const openEditModule = (module: Module) => {
    setSelectedModule(module);
    setNewModule({ title: module.title, description: module.description || "" });
    setIsEditModuleOpen(true);
  };

  const openAddLesson = (module: Module) => {
    setSelectedModule(module);
    setNewLesson({ title: "", description: "", type: "video", duration: "", isFree: false });
    setIsAddLessonOpen(true);
  };

  const openEditLesson = (module: Module, lesson: Lesson) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      duration: lesson.duration,
      isFree: lesson.isFree,
    });
    setIsEditLessonOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Curriculum</h3>
          <p className="text-sm text-muted-foreground">
            Organize your course into modules and lessons
          </p>
        </div>
        <Button onClick={() => setIsAddModuleOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No modules yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your course by adding a module
            </p>
            <Button variant="outline" onClick={() => setIsAddModuleOpen(true)}>
              Add Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group
          axis="y"
          values={modules}
          onReorder={handleReorderModules}
          className="space-y-4"
        >
          {modules.map((module, moduleIndex) => (
            <Reorder.Item
              key={module.id}
              value={module}
              className="cursor-grab active:cursor-grabbing"
            >
              <Card>
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex-shrink-0"
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Module {moduleIndex + 1}
                        </Badge>
                        <span className="font-medium truncate">{module.title}</span>
                      </div>
                      {module.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {module.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => openAddLesson(module)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Lesson
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModule(module)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteModule(module.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Module
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedModules.has(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="pt-0 pb-4">
                        {module.lessons.length === 0 ? (
                          <div className="border border-dashed rounded-lg p-6 text-center ml-8">
                            <p className="text-sm text-muted-foreground mb-3">
                              No lessons in this module
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAddLesson(module)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                          </div>
                        ) : (
                          <Reorder.Group
                            axis="y"
                            values={module.lessons}
                            onReorder={(newLessons) =>
                              handleReorderLessons(module.id, newLessons)
                            }
                            className="space-y-2 ml-8"
                          >
                            {module.lessons.map((lesson, lessonIndex) => (
                              <Reorder.Item
                                key={lesson.id}
                                value={lesson}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-muted-foreground">
                                    {lessonTypeIcons[lesson.type]}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium truncate">
                                        {lesson.title}
                                      </span>
                                      {lesson.isFree && (
                                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                          Free Preview
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{lessonTypeLabels[lesson.type]}</span>
                                      {lesson.duration && (
                                        <>
                                          <span>•</span>
                                          <span>{lesson.duration}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                                      <DropdownMenuItem onClick={() => openEditLesson(module, lesson)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" /> Preview
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        )}
                        <div className="ml-8 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddLesson(module)}
                            className="text-muted-foreground"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Add Module Dialog */}
      <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
            <DialogDescription>
              Create a new module to organize your lessons
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Module Title</Label>
              <Input
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                placeholder="e.g., Introduction to the Course"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                placeholder="Brief description of this module..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddModule} disabled={!newModule.title.trim()}>
              Add Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>Update module details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Module Title</Label>
              <Input
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                placeholder="e.g., Introduction to the Course"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                placeholder="Brief description of this module..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditModule} disabled={!newModule.title.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Dialog */}
      <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>
              Add a lesson to {selectedModule?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input
                value={newLesson.title || ""}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="e.g., Getting Started"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={newLesson.type}
                  onValueChange={(value: LessonType) =>
                    setNewLesson({ ...newLesson, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={newLesson.duration || ""}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                  placeholder="e.g., 15 min"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={newLesson.description || ""}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="What will students learn in this lesson?"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <Label>Free Preview</Label>
                <p className="text-sm text-muted-foreground">
                  Allow non-enrolled students to view this lesson
                </p>
              </div>
              <Switch
                checked={newLesson.isFree || false}
                onCheckedChange={(checked) => setNewLesson({ ...newLesson, isFree: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLessonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLesson} disabled={!newLesson.title?.trim()}>
              Add Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
            <DialogDescription>Update lesson details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input
                value={newLesson.title || ""}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="e.g., Getting Started"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={newLesson.type}
                  onValueChange={(value: LessonType) =>
                    setNewLesson({ ...newLesson, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={newLesson.duration || ""}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                  placeholder="e.g., 15 min"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={newLesson.description || ""}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="What will students learn in this lesson?"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <Label>Free Preview</Label>
                <p className="text-sm text-muted-foreground">
                  Allow non-enrolled students to view this lesson
                </p>
              </div>
              <Switch
                checked={newLesson.isFree || false}
                onCheckedChange={(checked) => setNewLesson({ ...newLesson, isFree: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLessonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLesson} disabled={!newLesson.title?.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleEditor;
