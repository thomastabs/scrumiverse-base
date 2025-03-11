
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SprintCardProps {
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "planned" | "completed";
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
}

export function SprintCard({
  title,
  startDate,
  endDate,
  progress,
  status,
  totalTasks,
  completedTasks,
  teamMembers,
}: SprintCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-status-inprogress text-status-inprogress-text";
      case "planned":
        return "bg-status-todo text-status-todo-text";
      case "completed":
        return "bg-status-done text-status-done-text";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden group animate-scale-in border-border/50 transition-all duration-300 hover:shadow-elevated h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={cn("mb-2 capitalize", getStatusColor())}>
              {status}
            </Badge>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <CalendarDays size={14} className="mr-1" />
          <span>
            {startDate} - {endDate}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-muted-foreground">
              <CheckCircle2 size={14} className="mr-1" />
              <span>
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users2 size={14} className="mr-1" />
              <span>{teamMembers}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SprintCard;
