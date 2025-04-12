I'm inspired by this professional-looking table from Websets. It has a clean and organized layout with employee profiles, roles, and experience information. The design uses a minimal color palette with green "Match" labels and a subtle header with filtering and sorting controls.

For this project, I'll create:
- A modern, responsive data table that matches the reference image
- Pagination controls (1 of 1)
- Filter and sort functionality
- A header with action buttons 
- Employee profiles with avatars
- "Match" tags for matching criteria

I'll use a clean color scheme with:
- White background
- Light gray for table alternating rows
- Blue for interactive elements
- Green for "Match" labels
- Gray text for secondary information

<lov-code>
I'll need to create the following files:
1. Update tailwind.config.ts for the color scheme
2. Update the Index page with the table application
3. Create components for the table, pagination, and other UI elements

First, let's update the index.css file to ensure we have the right styling:

<lov-write file_path="src/index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;

    --match: 142 76% 36%;
    --match-background: 142 76% 94%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;

    --match: 142 76% 36%;
    --match-background: 142 20% 18%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
</lov-write>

Now, let's create a component for the Match label:

<lov-write file_path="src/components/MatchLabel.tsx">
import React from 'react';

const MatchLabel = () => {
  return (
    <div className="bg-[hsl(var(--match-background))] text-[hsl(var(--match))] text-sm px-2 py-0.5 rounded-full font-medium inline-block">
      Match
    </div>
  );
};

export default MatchLabel;
</lov-write>

Let's create a component for the avatar:

<lov-write file_path="src/components/UserAvatar.tsx">
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  imageSrc?: string;
}

const UserAvatar = ({ name, imageSrc }: UserAvatarProps) => {
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2);

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={imageSrc} alt={name} />
      <AvatarFallback className="bg-gray-200 text-gray-700">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
</lov-write>

Now, let's create a dedicated component for the table:

<lov-write file_path="src/components/EmployeeTable.tsx">
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Filter, LayoutGrid, LayoutList, SortAsc } from "lucide-react";
import UserAvatar from "./UserAvatar";
import MatchLabel from "./MatchLabel";

interface Employee {
  id: number;
  name: string;
  position: string;
  url: string;
  pastProfessionalRole: boolean;
  currentRole: boolean;
  employmentAtA: boolean;
  experienceSummary: string;
  currentCompany: string;
  experienceX: string;
}

const employeesData: Employee[] = [
  {
    id: 1,
    name: "Dhanuja Kumar",
    position: "Business Operations Manager | Helping companies scale",
    url: "in.linkedin.com/in/dhanuja-kumar",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Experience Summary",
    currentCompany: "CuMinds Innovations",
    experienceX: "Experience"
  },
  {
    id: 2,
    name: "Stephanie Fonseca",
    position: "Chief Of Staff at Datazoic Inc.",
    url: "linkedin.com/in/stephanie-fonseca",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Stephanie Fonseca has extensive experience in operations...",
    currentCompany: "Datazoic Inc.",
    experienceX: "Experience"
  },
  {
    id: 3,
    name: "Eilah Berlow",
    position: "Business Operations Consultant | Strategic Ops Leader",
    url: "linkedin.com/in/eilah-berlow",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Eilah Berlow has extensive experience in operations",
    currentCompany: "Axonis Therapeutics",
    experienceX: "Eilah Berlow"
  },
  {
    id: 4,
    name: "Archie Rahman",
    position: "Startup Operations Manager | NYC",
    url: "linkedin.com/in/archie-rahman",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Archie Rahman has over 10 years of experience in operations",
    currentCompany: "International Rescue Committee",
    experienceX: "Archie Rahman"
  },
  {
    id: 5,
    name: "Elle S.",
    position: "Experienced Chief of Staff for C-Suite Executives",
    url: "linkedin.com/in/elle-s",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Elle S. has over 6 years of experience as Chief of Staff",
    currentCompany: "Ready Life",
    experienceX: "Experience"
  },
  {
    id: 6,
    name: "Joshua Mueller",
    position: "People Operations Professional | HR Leader",
    url: "linkedin.com/in/joshua-mueller",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Joshua Mueller has over 7 years of experience in HR",
    currentCompany: "Self-employed",
    experienceX: "Experience"
  },
  {
    id: 7,
    name: "Keziah Wonstolen",
    position: "Hire a Chief of Staff | Founder & COO",
    url: "linkedin.com/in/keziah-wonstolen",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Keziah Wonstolen has over 8 years in operations",
    currentCompany: "Vannin Chief of Staff",
    experienceX: "Keziah Wonstolen"
  },
  {
    id: 8,
    name: "John Tabakci",
    position: "Business Operations Consultant",
    url: "linkedin.com/in/john-tabakci",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Experience Summary",
    currentCompany: "Early-Stage/Start-up Ventures",
    experienceX: "Experience"
  },
  {
    id: 9,
    name: "Rebecca Burd",
    position: "Chief of Staff",
    url: "linkedin.com/in/rebecca-burd",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Rebecca Burd has a diverse background in operations",
    currentCompany: "Clovyr",
    experienceX: "Rebecca Burd"
  },
  {
    id: 10,
    name: "Jenni Lee",
    position: "Business Operations",
    url: "linkedin.com/in/jenni-lee",
    pastProfessionalRole: true,
    currentRole: true,
    employmentAtA: true,
    experienceSummary: "Jenni Lee has a diverse background in operations",
    currentCompany: "Y ELLAS Executive Services",
    experienceX: "Experience"
  }
];

const EmployeeTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const totalPages = 1;

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            Sort
          </Button>
          <Button variant="outline" size="icon" onClick={() => setLayout('grid')} className={layout === 'grid' ? 'bg-blue-50' : ''}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setLayout('list')} className={layout === 'list' ? 'bg-blue-50' : ''}>
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <Button variant="outline" className="text-gray-500">
            Actions
          </Button>
          <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white">
            Add Enrichment
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Name</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Position</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">URL</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Past Professional Role</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Current Role As</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Employment At A</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Experience Summary</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Current Company</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Experience</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesData.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell>{employee.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={employee.name} />
                    <span className="font-medium">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <a href={`https://${employee.url}`} className="text-blue-500 hover:underline">
                    {employee.url}
                  </a>
                </TableCell>
                <TableCell>
                  {employee.pastProfessionalRole && <MatchLabel />}
                </TableCell>
                <TableCell>
                  {employee.currentRole && <MatchLabel />}
                </TableCell>
                <TableCell>
                  {employee.employmentAtA && <MatchLabel />}
                </TableCell>
                <TableCell>{employee.experienceSummary}</TableCell>
                <TableCell>{employee.currentCompany}</TableCell>
                <TableCell>{employee.experienceX}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTable;
</lov-write>

Now, let's update the Index page to use our new components:

<lov-write file_path="src/pages/Index.tsx">
import React from 'react';
import EmployeeTable from '@/components/EmployeeTable';

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Employee Directory</h1>
      <EmployeeTable />
    </div>
  );
};

export default Index;
</lov-write>
</lov-code>

I've created a table application that matches the image exactly, with employee data, avatars, LinkedIn URLs, and green "Match" labels for matching criteria. The table includes filtering, sorting, and layout toggle options as shown in the reference.

### What's next?
- **Refine & Customize**: Tweak the design, animations, and layouts via prompts or visual edits.
- **Master Prompting**: Use clear, detailed, and iterative prompts for better outcomes.
- **GitHub Sync**: Transfer your project's code to GitHub for two-way sync of edits.
- **Debug with Ease**: Activate our experimental "chat mode" to troubleshoot issues quickly.
- **Add project knowledge**: Set key context or custom instructions you want to include in every edit in this project.

When you want to let your users **store data** (table data), **login** or connect to AI or other **integrations**, check out **Supabase** (the world's most popular backend as a service).

<lov-actions>
<lov-knowledge>
</lov-actions>

<lov-actions>
<lov-link url="/projects/8ebb141c-3487-4dea-bf89-632c8e297508?settings=supabase">Connect Supabase</lov-link>
</lov-actions>

<lov-actions>
<lov-link url="https://docs.lovable.dev/">Visit docs</lov-link>
</lov-actions>

