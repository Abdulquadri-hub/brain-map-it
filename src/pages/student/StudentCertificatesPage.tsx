import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink } from "lucide-react";
import { MOCK_STUDENT_CERTIFICATES } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { certificates } = usePage().props

const StudentCertificatesPage = () => {
  const certificates = MOCK_STUDENT_CERTIFICATES;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
        <p className="text-muted-foreground">Your earned certificates from completed batches.</p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Certificates Yet</h3>
            <p className="text-sm text-muted-foreground">Complete a batch to earn your first certificate.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-primary/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cert.courseName}</h3>
                      <p className="text-sm text-muted-foreground">{cert.batchName}</p>
                    </div>
                  </div>
                  <Badge className="text-lg px-3">{cert.grade}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div><p className="font-semibold">#{cert.rank}</p><p className="text-xs text-muted-foreground">Rank</p></div>
                  <div><p className="font-semibold">{cert.totalStudents}</p><p className="text-xs text-muted-foreground">Students</p></div>
                  <div><p className="font-semibold">{new Date(cert.issueDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}</p><p className="text-xs text-muted-foreground">Issued</p></div>
                </div>
                <div className="text-xs text-muted-foreground text-center border rounded p-2">
                  Verification: <code className="font-mono">{cert.verificationCode}</code>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
