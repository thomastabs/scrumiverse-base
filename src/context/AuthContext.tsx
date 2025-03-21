
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, ProjectRole } from "@/types";
import { supabase, withRetry } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOwner: boolean;
  userRole: ProjectRole | null;
  theme: "dark" | "light";
  setIsOwner: (isOwner: boolean) => void;
  setUserRole: (role: ProjectRole | null) => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUsername: (newUsername: string) => Promise<boolean>;
  updateEmail: (newEmail: string, password: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOwner: false,
  userRole: null,
  theme: "dark",
  setIsOwner: () => {},
  setUserRole: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUsername: async () => false,
  updateEmail: async () => false,
  updatePassword: async () => false,
  toggleTheme: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("theme") as "dark" | "light") || "dark"
  );

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const savedUser = localStorage.getItem("scrumUser");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.removeItem("scrumUser");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserFromStorage();
  }, []);

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { data: existingEmail } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();
      });

      if (existingEmail) {
        throw new Error('Email already in use');
      }

      const { data: existingUsername } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single();
      });

      if (existingUsername) {
        throw new Error('Username already taken');
      }

      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('users')
          .insert([{ username, email, password }])
          .select()
          .single();
      });

      if (error) throw error;

      if (data) {
        const newUser: User = {
          id: data.id,
          email: data.email,
          username: data.username,
        };
        
        setUser(newUser);
        localStorage.setItem("scrumUser", JSON.stringify(newUser));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('*')
          .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
          .eq('password', password)
          .single();
      });

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      const loggedInUser: User = {
        id: data.id,
        email: data.email,
        username: data.username,
      };
      
      setUser(loggedInUser);
      localStorage.setItem("scrumUser", JSON.stringify(loggedInUser));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsOwner(false);
    setUserRole(null);
    localStorage.removeItem("scrumUser");
  };

  const updateUsername = async (newUsername: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('No user logged in');

      // Check if username is already taken
      const { data: existingUsername } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('username')
          .eq('username', newUsername)
          .single();
      });

      if (existingUsername) {
        toast.error('Username already taken');
        return false;
      }

      // Update username in users table
      const { error } = await withRetry(async () => {
        return await supabase
          .from('users')
          .update({ username: newUsername })
          .eq('id', user.id);
      });

      if (error) throw error;

      // Update local user data
      const updatedUser = { ...user, username: newUsername };
      setUser(updatedUser);
      localStorage.setItem("scrumUser", JSON.stringify(updatedUser));
      
      toast.success('Username updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating username:', error);
      toast.error(error.message || 'Failed to update username');
      return false;
    }
  };

  const updateEmail = async (newEmail: string, password: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('No user logged in');

      // Verify password
      const { data: validUser } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .eq('password', password)
          .single();
      });

      if (!validUser) {
        toast.error('Current password is incorrect');
        return false;
      }

      // Check if email is already in use
      const { data: existingEmail } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('email')
          .eq('email', newEmail)
          .single();
      });

      if (existingEmail) {
        toast.error('Email already in use');
        return false;
      }

      // Update email in users table
      const { error } = await withRetry(async () => {
        return await supabase
          .from('users')
          .update({ email: newEmail })
          .eq('id', user.id);
      });

      if (error) throw error;

      // Update local user data
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      localStorage.setItem("scrumUser", JSON.stringify(updatedUser));
      
      toast.success('Email updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast.error(error.message || 'Failed to update email');
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) throw new Error('No user logged in');

      // Verify current password
      const { data: validUser } = await withRetry(async () => {
        return await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .eq('password', currentPassword)
          .single();
      });

      if (!validUser) {
        toast.error('Current password is incorrect');
        return false;
      }

      // Update password in users table
      const { error } = await withRetry(async () => {
        return await supabase
          .from('users')
          .update({ password: newPassword })
          .eq('id', user.id);
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isOwner,
        userRole,
        theme,
        setIsOwner,
        setUserRole,
        login,
        register,
        logout,
        updateUsername,
        updateEmail,
        updatePassword,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
