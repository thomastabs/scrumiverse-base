
import React from "react";
import Dashboard from "@/components/layout/Dashboard";
import SprintCard from "@/components/sprint/SprintCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SprintPage = () => {
  const mockSprints = [
    {
      id: "sprint-1",
      title: "Sprint 24: User Dashboard",
      startDate: "Sep 1, 2023",
      endDate: "Sep 15, 2023",
      progress: 65,
      status: "active" as const,
      totalTasks: 12,
      completedTasks: 8,
      teamMembers: 4,
    },
    {
      id: "sprint-2",
      title: "Sprint 25: API Integration",
      startDate: "Sep 16, 2023",
      endDate: "Sep 30, 2023",
      progress: 0,
      status: "planned" as const,
      totalTasks: 10,
      completedTasks: 0,
      teamMembers: 3,
    },
    {
      id: "sprint-3",
      title: "Sprint 26: UI Polish",
      startDate: "Oct 1, 2023",
      endDate: "Oct 15, 2023",
      progress: 0,
      status: "planned" as const,
      totalTasks: 8,
      completedTasks: 0,
      teamMembers: 4,
    },
    {
      id: "sprint-4",
      title: "Sprint 23: Authentication",
      startDate: "Aug 15, 2023",
      endDate: "Aug 31, 2023",
      progress: 100,
      status: "completed" as const,
      totalTasks: 10,
      completedTasks: 10,
      teamMembers: 5,
    },
    {
      id: "sprint-5",
      title: "Sprint 22: Initial Setup",
      startDate: "Aug 1, 2023",
      endDate: "Aug 14, 2023",
      progress: 100,
      status: "completed" as const,
      totalTasks: 8,
      completedTasks: 8,
      teamMembers: 3,
    },
  ];

  const filteredSprints = (status: string) => {
    return mockSprints.filter((sprint) => sprint.status === status);
  };

  return (
    <Dashboard>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
            <p className="text-muted-foreground mt-1">
              Manage your project sprints and track progress.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus size={16} className="mr-1" /> New Sprint
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planned">Planned</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSprints.map((sprint) => (
                <SprintCard key={sprint.id} {...sprint} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSprints("active").map((sprint) => (
                <SprintCard key={sprint.id} {...sprint} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="planned" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSprints("planned").map((sprint) => (
                <SprintCard key={sprint.id} {...sprint} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSprints("completed").map((sprint) => (
                <SprintCard key={sprint.id} {...sprint} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default SprintPage;
