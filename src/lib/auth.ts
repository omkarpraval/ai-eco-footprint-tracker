
// This is a simple localStorage-based auth system
// In a production app, you'd use Supabase, Firebase, Clerk, or another auth provider

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const AUTH_KEY = 'eco_tracker_auth';

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as User;
  } catch (e) {
    console.error('Failed to parse stored user', e);
    return null;
  }
};

export const loginUser = (email: string, password: string): Promise<User> => {
  // In a real app, this would call an API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept any email/password
      if (!email.includes('@') || password.length < 6) {
        reject(new Error('Invalid email or password'));
        return;
      }
      
      const user: User = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      resolve(user);
    }, 500); // Simulate network delay
  });
};

export const registerUser = (email: string, password: string, name: string): Promise<User> => {
  // In a real app, this would call an API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple validation
      if (!email.includes('@') || password.length < 6) {
        reject(new Error('Invalid email or password'));
        return;
      }
      
      const user: User = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      resolve(user);
    }, 800); // Simulate network delay
  });
};

export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
