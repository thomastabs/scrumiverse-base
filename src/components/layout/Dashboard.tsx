
import React from "react";
import Navbar from "./Navbar";

interface DashboardProps {
  children: React.ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}

export default Dashboard;
