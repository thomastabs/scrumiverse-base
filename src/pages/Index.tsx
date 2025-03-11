
import React from "react";
import Dashboard from "@/components/layout/Dashboard";
import SprintCard from "@/components/sprint/SprintCard";
import TaskBoard from "@/components/task/TaskBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockTasks = [
  {
    id: "task-1",
    title: "Create user dashboard wireframes",
    description: "Design initial wireframes for the user dashboard",
    status: "todo" as const,
    priority: "medium" as const,
    assignee: { name: "Alex Johnson" },
    points: 3,
  },
  {
    id: "task-2",
    title: "Implement authentication logic",
    description: "Set up user authentication flow",
    status: "inprogress" as const,
    priority: "high" as const,
    assignee: { name: "Morgan Smith" },
    dueDate: "Sep 15",
    points: 5,
  },
  {
    id: "task-3",
    title: "Write API documentation",
    description: "Document all API endpoints",
    status: "review" as const,
    priority: "low" as const,
    assignee: { name: "Jamie Lee" },
    dueDate: "Sep 18",
    points: 2,
  },
  {
    id: "task-4",
    title: "Fix navigation bug",
    description: "Fix the navigation issue in mobile view",
    status: "todo" as const,
    priority: "high" as const,
    points: 3,
  },
  {
    id: "task-5",
    title: "Refactor CSS styles",
    description: "Clean up and organize CSS files",
    status: "done" as const,
    priority: "low" as const,
    assignee: { name: "Riley Chen" },
    points: 1,
  },
  {
    id: "task-6",
    title: "Create database schema",
    status: "inprogress" as const,
    priority: "medium" as const,
    assignee: { name: "Morgan Smith" },
    points: 3,
  },
  {
    id: "task-7",
    title: "Implement responsive design",
    status: "review" as const,
    priority: "medium" as const,
    assignee: { name: "Jamie Lee" },
    points: 2,
  },
  {
    id: "task-8",
    title: "Set up CI/CD pipeline",
    status: "done" as const,
    priority: "high" as const,
    assignee: { name: "Alex Johnson" },
    points: 5,
  },
];

const mockTeamMembers = [
  { id: "1", name: "Alex Johnson" },
  { id: "2", name: "Morgan Smith" },
  { id: "3", name: "Jamie Lee" },
  { id: "4", name: "Riley Chen" },
];

const Index = () => {
  return (
    <Dashboard>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your team's progress and manage tasks efficiently.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline">
              <Plus size={16} className="mr-1" /> New Sprint
            </Button>
            <Button>
              <Plus size={16} className="mr-1" /> New Task
            </Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Sprint</h2>
            <Link to="/sprints">
              <Button variant="ghost" size="sm" className="text-sm gap-1">
                View all sprints <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Sprint Progress</CardTitle>
                  <div className="flex gap-2">
                    <AvatarGroup>
                      {mockTeamMembers.map((member) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskBoard tasks={mockTasks} onAddTask={() => {}} />
              </CardContent>
            </Card>
            <SprintCard
              title="Sprint 24: User Dashboard"
              startDate="Sep 1, 2023"
              endDate="Sep 15, 2023"
              progress={65}
              status="active"
              totalTasks={12}
              completedTasks={8}
              teamMembers={4}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Sprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SprintCard
              title="Sprint 25: API Integration"
              startDate="Sep 16, 2023"
              endDate="Sep 30, 2023"
              progress={0}
              status="planned"
              totalTasks={10}
              completedTasks={0}
              teamMembers={3}
            />
            <SprintCard
              title="Sprint 26: UI Polish"
              startDate="Oct 1, 2023"
              endDate="Oct 15, 2023"
              progress={0}
              status="planned"
              totalTasks={8}
              completedTasks={0}
              teamMembers={4}
            />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
