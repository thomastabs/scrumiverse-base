
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "todo" | "inprogress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  points?: number;
}

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  dueDate,
  points,
}: TaskCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card 
      className="scrum-card cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated animate-scale-in"
      draggable
    >
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Badge className={`status-${status}`}>
            {status === "inprogress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {points !== undefined && (
            <div className="rounded-full bg-secondary w-6 h-6 flex items-center justify-center text-xs font-medium">
              {points}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-3 py-2 flex justify-between items-center border-t border-border/50">
        {assignee && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-xs">
                {getInitials(assignee.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{assignee.name}</span>
          </div>
        )}
        
        {dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            <span>{dueDate}</span>
          </div>
        )}
        
        {!assignee && !dueDate && (
          <Badge className={`priority-${priority}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}

export default TaskCard;
