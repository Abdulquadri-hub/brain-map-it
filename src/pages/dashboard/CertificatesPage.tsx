import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Search,
  Download,
  Eye,
  FileCheck,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Certificate } from "@/types/batch";

/**
 * CertificatesPage - Certificate Management
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive certificates from CertificateController@index
 * - router.post('/certificates/generate', { batchId }) to generate certificates
 * - router.get('/certificates/:id/download') to download PDF
 */

const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    studentId: "s-6",
    batchId: "batch-4",
    courseId: "course-3",
    studentName: "Fatima Abdullahi",
    courseName: "Physics for SSS2",
    batchName: "December 2024 Batch",
    issueDate: "2025-03-14",
    grade: "A",
    rank: 1,
    totalStudents: 28,
    verificationCode: "TEACH-2025-PHY-001",
    verificationUrl: "https://teach.app/verify/TEACH-2025-PHY-001",
  },
  {
    id: "cert-2",
    studentId: "s-9",
    batchId: "batch-4",
    courseId: "course-3",
    studentName: "Kelechi Nnadi",
    courseName: "Physics for SSS2",
    batchName: "December 2024 Batch",
    issueDate: "2025-03-14",
    grade: "A",
    rank: 2,
    totalStudents: 28,
    verificationCode: "TEACH-2025-PHY-002",
    verificationUrl: "https://teach.app/verify/TEACH-2025-PHY-002",
  },
  {
    id: "cert-3",
    studentId: "s-10",
    batchId: "batch-4",
    courseId: "course-3",
    studentName: "Olumide Bakare",
    courseName: "Physics for SSS2",
    batchName: "December 2024 Batch",
    issueDate: "2025-03-14",
    grade: "B",
    rank: 5,
    totalStudents: 28,
    verificationCode: "TEACH-2025-PHY-003",
    verificationUrl: "https://teach.app/verify/TEACH-2025-PHY-003",
  },
];

const pendingBatches = [
  { id: "batch-1", name: "January 2025 Batch", courseName: "Mathematics for JSS1", students: 25, status: "active" },
  { id: "batch-3", name: "March 2025 Cohort", courseName: "Web Development Bootcamp", students: 20, status: "closed" },
];

const CertificatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchFilter === "all" || cert.batchId === batchFilter;
    return matchesSearch && matchesBatch;
  });

  const handleGenerate = (batchId: string) => {
    // Laravel Inertia.js: router.post('/certificates/generate', { batchId })
    toast.success("Certificate generation started. This may take a few minutes.");
  };

  const handleDownload = (cert: Certificate) => {
    // Laravel Inertia.js: window.open(route('certificates.download', cert.id))
    toast.info("Downloading certificate...");
  };

  const getGradeBadge = (grade: string) => {
    const styles: Record<string, string> = {
      A: "bg-primary/10 text-primary border-primary/20",
      B: "bg-secondary/10 text-secondary border-secondary/20",
      C: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      D: "bg-muted text-muted-foreground border-border",
      F: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return <Badge variant="outline" className={styles[grade] || ""}>{grade}</Badge>;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Certificates</h1>
          <p className="text-sm text-muted-foreground">Issue and manage certificates for completed batches.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issued</p>
                <p className="text-2xl font-bold text-primary">{mockCertificates.length}</p>
              </div>
              <FileCheck className="h-8 w-8 text-primary/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Generation</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBatches.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Batches</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Generate Certificates for Pending Batches */}
      {pendingBatches.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Batches Ready for Certificates</CardTitle>
            <CardDescription>Generate certificates for batches that have completed or are nearing completion.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">{batch.courseName} · {batch.students} students</p>
                  </div>
                  <Button size="sm" onClick={() => handleGenerate(batch.id)}>
                    <Award className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by student name or verification code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                <SelectItem value="batch-4">December 2024 Batch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Issued Certificates</CardTitle>
          <CardDescription>Showing {filteredCertificates.length} certificates</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course / Batch</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Verification Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issued</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{cert.studentName}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{cert.courseName}</p>
                      <p className="text-xs text-muted-foreground">{cert.batchName}</p>
                    </td>
                    <td className="py-3 px-4">{getGradeBadge(cert.grade)}</td>
                    <td className="py-3 px-4 text-sm text-foreground">#{cert.rank} of {cert.totalStudents}</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">{cert.verificationCode}</code>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{cert.issueDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedCertificate(cert)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(cert)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="border-2 border-primary/20 rounded-lg p-8 text-center space-y-4 bg-card">
              <Award className="h-12 w-12 text-primary mx-auto" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Certificate of Completion</p>
                <h3 className="text-2xl font-display font-bold text-foreground mt-2">{selectedCertificate.studentName}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Has successfully completed the course
              </p>
              <p className="text-lg font-semibold text-primary">{selectedCertificate.courseName}</p>
              <p className="text-sm text-muted-foreground">
                {selectedCertificate.batchName} · Grade: {selectedCertificate.grade} · Rank #{selectedCertificate.rank} of {selectedCertificate.totalStudents}
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Issued: {selectedCertificate.issueDate}</p>
                <p className="text-xs text-muted-foreground">Verification: {selectedCertificate.verificationCode}</p>
              </div>
              <Button onClick={() => handleDownload(selectedCertificate)} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesPage;
