import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Send, Package, ArrowRight, Trash, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import TaskCard from "@/components/tasks/TaskCard";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BacklogItemForm from "./BacklogItemForm";

const ProductBacklog: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { 
    getProject, 
    getSprintsByProject, 
    getBacklogTasks, 
    addTask, 
    updateTask,
    deleteTask
  } = useProjects();
  const navigate = useNavigate();
  
  const [backlogTasks, setBacklogTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [movingTask, setMovingTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  const project = projectId ? getProject(projectId) : undefined;
  const sprints = projectId ? getSprintsByProject(projectId) : [];
  const availableSprints = sprints.filter(sprint => sprint.status !== "completed");
  
  // Fetch all backlog tasks
  useEffect(() => {
    if (!projectId) return;
    
    console.log('Fetching backlog tasks for project ID:', projectId); // Add logging to help debug
    const tasks = getBacklogTasks(projectId);
    console.log('Retrieved backlog tasks:', tasks); // Add logging to help debug
    setBacklogTasks(tasks);
  }, [projectId, getBacklogTasks]);
  
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId && 
      destination.index === source.index
    ) {
      return;
    }
    
    try {
      // Update the task status
      await updateTask(draggableId, {
        status: destination.droppableId === "backlog" ? "backlog" : destination.droppableId
      });
      
      // Refresh backlog tasks
      const tasks = getBacklogTasks(projectId);
      setBacklogTasks(tasks);
      
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };
  
  const handleMoveToSprint = async (taskId: string, sprintId: string) => {
    if (!taskId || !sprintId) return;
    
    try {
      await updateTask(taskId, {
        sprintId,
        status: "todo"  // Default to todo when moving to a sprint
      });
      
      toast.success("Task moved to sprint");
      setMovingTask(null);
      
      // Refresh backlog tasks
      if (projectId) {
        const tasks = getBacklogTasks(projectId);
        setBacklogTasks(tasks);
      }
    } catch (error) {
      console.error("Error moving task to sprint:", error);
      toast.error("Failed to move task to sprint");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Backlog item deleted successfully");
      
      // Refresh backlog tasks
      if (projectId) {
        const tasks = getBacklogTasks(projectId);
        setBacklogTasks(tasks);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Filter backlog tasks by search query and priority
  const filteredBacklogTasks = backlogTasks
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )
    .filter(task => 
      priorityFilter === "all" || task.priority === priorityFilter
    );
  
  const getPriorityClass = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Project not found</h2>
        <button
          onClick={() => navigate("/projects")}
          className="scrum-button"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Product Backlog</h2>
          <p className="text-scrum-text-secondary">
            Manage your project's backlog items and move them to sprints
          </p>
        </div>
        
        <Button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Backlog Item</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search backlog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-44">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-background border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-muted-foreground h-5 w-5" />
            <h3 className="font-medium">Backlog Items</h3>
          </div>
          
          <Droppable droppableId="backlog">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[200px] ${snapshot.isDraggingOver ? "bg-accent/10" : ""}`}
              >
                {filteredBacklogTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items in the backlog</p>
                    <p className="text-sm mt-2">
                      Add tasks to your backlog to plan future work
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBacklogTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                          >
                            <Card className="hover:shadow-sm transition-shadow">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{task.title}</CardTitle>
                                  <Badge variant="outline" className={getPriorityClass(task.priority)}>
                                    {task.priority || "none"}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <p className="text-sm text-muted-foreground mb-2">{task.description || ""}</p>
                                <Badge variant="secondary">SP: {task.storyPoints || 0}</Badge>
                              </CardContent>
                              <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => setEditingTask(task.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3.5 w-3.5 mr-1"
                                    >
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                    </svg>
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-destructive"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    <Trash className="h-3.5 w-3.5 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                                
                                {availableSprints.length > 0 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" className="h-8">
                                        <ArrowRight className="h-3.5 w-3.5 mr-1" />
                                        Move to Sprint
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Move to Sprint</DialogTitle>
                                        <DialogDescription>
                                          Select a sprint to move this task to:
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {availableSprints.map(sprint => (
                                          <Button
                                            key={sprint.id}
                                            onClick={() => handleMoveToSprint(task.id, sprint.id)}
                                            variant="outline"
                                            className="w-full justify-start h-auto py-3"
                                          >
                                            <div className="text-left">
                                              <p className="font-medium">{sprint.title}</p>
                                              <p className="text-xs text-muted-foreground">
                                                {new Date(sprint.startDate).toLocaleDateString()} to {new Date(sprint.endDate).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </Button>
                                        ))}
                                      </div>
                                      
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </CardFooter>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      
      {/* Edit Task Modal */}
      {editingTask && (
        <BacklogItemForm
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
          projectId={projectId}
        />
      )}
      
      {/* Add New Task Modal */}
      {isAddingTask && (
        <BacklogItemForm 
          onClose={() => setIsAddingTask(false)}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProductBacklog;
