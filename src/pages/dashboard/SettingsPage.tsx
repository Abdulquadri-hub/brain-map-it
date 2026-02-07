import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  School, 
  Bell, 
  Lock, 
  CreditCard, 
  Users,
  Globe,
  Palette,
  Mail,
  Save,
  Upload,
  Store,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

/**
 * SettingsPage - School Settings & Marketplace Listing
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive school settings
 * - router.put('/settings/school', data) to save
 * - router.post('/settings/marketplace/submit') to submit for verification
 */

type VerificationStatus = "not_listed" | "pending" | "verified" | "rejected";

const SettingsPage = () => {
  const [schoolSettings, setSchoolSettings] = useState({
    name: "Greenfield Academy",
    email: "info@greenfieldacademy.edu",
    phone: "+234 801 234 5678",
    address: "123 Education Lane, Lagos, Nigeria",
    website: "www.greenfieldacademy.edu",
    description: "A leading institution committed to academic excellence and character development.",
    timezone: "Africa/Lagos",
    language: "en",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    enrollmentAlerts: true,
    paymentAlerts: true,
    courseUpdates: false,
    weeklyReports: true,
  });

  const [billing, setBilling] = useState({
    plan: "Professional",
    billingCycle: "monthly",
    nextBillingDate: "Dec 15, 2024",
    amount: "₦49,999",
  });

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("not_listed");
  const [marketplaceData, setMarketplaceData] = useState({
    displayName: "Greenfield Academy",
    description: "A leading institution committed to academic excellence and character development in Lagos, Nigeria.",
    category: "Secondary Education",
    location: "Lagos, Nigeria",
    logo: "",
    proofDocument: "",
  });

  const handleSaveSchool = () => {
    toast.success("School settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated!");
  };

  const handleSubmitVerification = () => {
    if (!marketplaceData.displayName || !marketplaceData.description || !marketplaceData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    setVerificationStatus("pending");
    toast.success("Marketplace listing submitted for verification! You'll be notified when approved.");
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "not_listed":
        return <Badge variant="outline" className="text-muted-foreground">Not Listed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "verified":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your school's preferences and configurations.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="general" className="gap-2">
            <School className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="gap-2">
            <Store className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Profile</CardTitle>
                <CardDescription>Update your school's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">GA</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
                  </div>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={schoolSettings.name} onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" value={schoolSettings.email} onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={schoolSettings.phone} onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={schoolSettings.website} onChange={(e) => setSchoolSettings({ ...schoolSettings, website: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={schoolSettings.address} onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={schoolSettings.description} onChange={(e) => setSchoolSettings({ ...schoolSettings, description: e.target.value })} rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={schoolSettings.timezone} onValueChange={(value) => setSchoolSettings({ ...schoolSettings, timezone: value })}>
                      <SelectTrigger>
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                        <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={schoolSettings.language} onValueChange={(value) => setSchoolSettings({ ...schoolSettings, language: value })}>
                      <SelectTrigger>
                        <Palette className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSchool}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications in browser" },
                  { key: "enrollmentAlerts", label: "Enrollment Alerts", desc: "Get notified when students enroll" },
                  { key: "paymentAlerts", label: "Payment Alerts", desc: "Receive payment and billing notifications" },
                  { key: "courseUpdates", label: "Course Updates", desc: "Notifications about course changes" },
                  { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly summary reports" },
                ].map((item, i) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                      />
                    </div>
                    {i < 5 && <Separator className="mt-4" />}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your subscription details and billing information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{billing.plan} Plan</h3>
                      <p className="text-sm text-muted-foreground">Billed {billing.billingCycle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{billing.amount}</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next billing date:</span>
                    <span className="font-medium text-foreground">{billing.nextBillingDate}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => toast.info("Upgrade options coming soon!")}>Upgrade Plan</Button>
                  <Button variant="ghost" onClick={() => toast.info("Billing history coming soon!")}>View Billing History</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-card rounded">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Payment method update coming soon!")}>Update</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your account password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
                <Button onClick={() => toast.success("Password updated successfully!")}>Update Password</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-factor authentication is disabled</p>
                    <p className="text-sm text-muted-foreground">Enable 2FA to secure your account</p>
                  </div>
                  <Button variant="outline" onClick={() => toast.info("2FA setup coming soon!")}>Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>Manage your active sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Current Session</p>
                    <p className="text-sm text-muted-foreground">Lagos, Nigeria • Chrome on Windows</p>
                  </div>
                  <span className="text-xs text-primary">Active now</span>
                </div>
                <Button variant="ghost" className="mt-4 text-destructive hover:text-destructive" onClick={() => toast.success("All other sessions logged out!")}>
                  Log out all other sessions
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage who has access to this school's dashboard.</CardDescription>
                  </div>
                  <Button onClick={() => toast.info("Invite feature coming soon!")}>
                    <Mail className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Admin", email: "john@greenfieldacademy.edu", role: "Owner" },
                    { name: "Sarah Manager", email: "sarah@greenfieldacademy.edu", role: "Admin" },
                    { name: "Mike Staff", email: "mike@greenfieldacademy.edu", role: "Editor" },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Select defaultValue={member.role.toLowerCase()}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Marketplace Listing */}
        <TabsContent value="marketplace">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Marketplace Listing
                    </CardTitle>
                    <CardDescription>List your school on the public marketplace for students to discover you.</CardDescription>
                  </div>
                  {getVerificationBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {verificationStatus === "verified" ? (
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">Your school is verified!</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your school appears on the marketplace with a verified badge.</p>
                  </div>
                ) : verificationStatus === "pending" ? (
                  <div className="p-6 bg-yellow-500/5 rounded-lg border border-yellow-500/20 text-center">
                    <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">Verification in progress</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your listing is being reviewed. This typically takes 1-3 business days.</p>
                  </div>
                ) : verificationStatus === "rejected" ? (
                  <div className="p-6 bg-destructive/5 rounded-lg border border-destructive/20 text-center">
                    <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">Listing rejected</h3>
                    <p className="text-sm text-muted-foreground mt-1">Please update your information and resubmit.</p>
                  </div>
                ) : null}

                {(verificationStatus === "not_listed" || verificationStatus === "rejected") && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Display Name *</Label>
                        <Input
                          value={marketplaceData.displayName}
                          onChange={(e) => setMarketplaceData({ ...marketplaceData, displayName: e.target.value })}
                          placeholder="Your school name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={marketplaceData.category} onValueChange={(v) => setMarketplaceData({ ...marketplaceData, category: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Primary Education">Primary Education</SelectItem>
                            <SelectItem value="Secondary Education">Secondary Education</SelectItem>
                            <SelectItem value="Web Development">Web Development</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                            <SelectItem value="Languages">Languages</SelectItem>
                            <SelectItem value="STEM">STEM</SelectItem>
                            <SelectItem value="Arts & Design">Arts & Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input
                        value={marketplaceData.location}
                        onChange={(e) => setMarketplaceData({ ...marketplaceData, location: e.target.value })}
                        placeholder="e.g., Lagos, Nigeria"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Marketplace Description *</Label>
                      <Textarea
                        value={marketplaceData.description}
                        onChange={(e) => setMarketplaceData({ ...marketplaceData, description: e.target.value })}
                        placeholder="Describe your school for potential students..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>School Logo</Label>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Displayed on your marketplace card.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Proof Documents</Label>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                        <p className="text-xs text-muted-foreground">Business registration, teaching certification, etc.</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitVerification}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Submit for Verification
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
