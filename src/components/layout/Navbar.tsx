
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Check, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-scrum-card border-b border-scrum-border px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Check className="h-6 w-6 text-white" />
          <h1 className="text-xl font-semibold text-white">Scrumify Hub</h1>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-scrum-text-secondary">{user.email}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <div className="h-8 w-8 rounded-full bg-white text-scrum-card flex items-center justify-center font-semibold hover:ring-2 hover:ring-white/50 transition-all">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Navbar;
