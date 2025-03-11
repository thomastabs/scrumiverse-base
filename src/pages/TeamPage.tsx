
import React from "react";
import Dashboard from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Plus, UserPlus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
  tasksCompleted: number;
  tasksTotal: number;
  tasksInProgress: number;
}

const TeamPage = () => {
  const mockTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Frontend Developer",
      email: "alex.j@example.com",
      tasksCompleted: 24,
      tasksTotal: 30,
      tasksInProgress: 2,
    },
    {
      id: "2",
      name: "Morgan Smith",
      role: "Backend Developer",
      email: "morgan.s@example.com",
      tasksCompleted: 18,
      tasksTotal: 22,
      tasksInProgress: 3,
    },
    {
      id: "3",
      name: "Jamie Lee",
      role: "UI/UX Designer",
      email: "jamie.l@example.com",
      tasksCompleted: 15,
      tasksTotal: 20,
      tasksInProgress: 1,
    },
    {
      id: "4",
      name: "Riley Chen",
      role: "QA Engineer",
      email: "riley.c@example.com",
      tasksCompleted: 30,
      tasksTotal: 35,
      tasksInProgress: 2,
    },
    {
      id: "5",
      name: "Taylor Park",
      role: "Project Manager",
      email: "taylor.p@example.com",
      tasksCompleted: 10,
      tasksTotal: 15,
      tasksInProgress: 4,
    },
    {
      id: "6",
      name: "Jordan Rivera",
      role: "DevOps Engineer",
      email: "jordan.r@example.com",
      tasksCompleted: 22,
      tasksTotal: 26,
      tasksInProgress: 1,
    },
  ];

  return (
    <Dashboard>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and track contributions.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <UserPlus size={16} className="mr-1" /> Add Team Member
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-elevated transition-all duration-300 animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Mail size={16} />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Task Progress</span>
                      <span className="font-medium">
                        {member.tasksCompleted}/{member.tasksTotal}
                      </span>
                    </div>
                    <Progress 
                      value={(member.tasksCompleted / member.tasksTotal) * 100} 
                      className="h-1.5" 
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className="bg-status-inprogress text-status-inprogress-text">
                      {member.tasksInProgress} In Progress
                    </Badge>
                    <Badge className="bg-status-done text-status-done-text">
                      {member.tasksCompleted} Completed
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="flex items-center justify-center h-[216px] border-dashed">
            <Button variant="ghost" className="h-20 w-20 rounded-full">
              <Plus size={24} />
            </Button>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
};

export default TeamPage;
