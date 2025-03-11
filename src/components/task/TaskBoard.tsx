
import React from "react";
import { TaskCard, TaskStatus } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  points?: number;
}

interface TaskBoardProps {
  tasks: Task[];
  onAddTask?: () => void;
}

export function TaskBoard({ tasks, onAddTask }: TaskBoardProps) {
  const columns: { id: TaskStatus; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
      {columns.map((column) => (
        <div key={column.id} className="min-w-[280px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              {column.title}{" "}
              <span className="ml-1 text-xs">
                ({getTasksByStatus(column.id).length})
              </span>
            </h3>
            
            {column.id === "todo" && onAddTask && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={onAddTask}
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
          
          <div 
            className={cn(
              "space-y-3 p-3 rounded-lg bg-muted/40 min-h-[200px]",
              column.id === "todo" && "bg-status-todo/20",
              column.id === "inprogress" && "bg-status-inprogress/20",
              column.id === "review" && "bg-status-review/20",
              column.id === "done" && "bg-status-done/20"
            )}
          >
            {getTasksByStatus(column.id).map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskBoard;
