import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface SchoolProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  description: string;
  logo: File | null;
  website: string;
  established: string;
  schoolType: string;
}

interface SchoolProfileStepProps {
  data: SchoolProfileData;
  onUpdate: (updates: Partial<SchoolProfileData>) => void;
}

const countries = [
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Ethiopia",
  "Egypt",
  "Morocco",
];

const schoolTypes = [
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School" },
  { value: "combined", label: "Combined (Primary & Secondary)" },
  { value: "vocational", label: "Vocational/Technical" },
  { value: "university", label: "University/College" },
];

const SchoolProfileStep = ({ data, onUpdate }: SchoolProfileStepProps) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onUpdate({ logo: file });
    
    // TODO: For Laravel Inertia, you might want to upload immediately
    // or handle file uploads differently using Inertia's form helpers
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-xl bg-muted/30">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {data.logo ? (
            <img
              src={URL.createObjectURL(data.logo)}
              alt="School logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <Label
            htmlFor="logo"
            className="cursor-pointer text-primary hover:underline font-medium"
          >
            Upload School Logo
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            PNG, JPG up to 2MB
          </p>
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">School Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Lagos International Academy"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolType">School Type *</Label>
          <Select
            value={data.schoolType}
            onValueChange={(value) => onUpdate({ schoolType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select school type" />
            </SelectTrigger>
            <SelectContent>
              {schoolTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">School Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="info@school.edu"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+234 800 000 0000"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://www.school.edu"
            value={data.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="established">Year Established</Label>
          <Input
            id="established"
            type="number"
            placeholder="e.g., 1990"
            min="1800"
            max={new Date().getFullYear()}
            value={data.established}
            onChange={(e) => onUpdate({ established: e.target.value })}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Street Address *</Label>
        <Input
          id="address"
          placeholder="123 Education Street"
          value={data.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="Lagos"
            value={data.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            value={data.country}
            onValueChange={(value) => onUpdate({ country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">School Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your school's mission, values, and what makes it special..."
          rows={4}
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />
        <p className="text-sm text-muted-foreground">
          This will be displayed on your public school profile
        </p>
      </div>
    </div>
  );
};

export default SchoolProfileStep;
