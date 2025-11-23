import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { EnhancedUserDashboard } from './components/EnhancedUserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  type: 'user' | 'admin';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  quantity: number;
  available: number;
  publishDate: string;
  coverUrl?: string;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowRegistration(false);
  };

  const handleRegister = (user: User) => {
    // In a real app, you would save the user to a database
    // For now, just switch to login page after successful registration
    setShowRegistration(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowRegistration(false);
  };

  // Show registration page
  if (!currentUser && showRegistration) {
    return (
      <>
        <RegistrationPage 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setShowRegistration(false)} 
        />
        <Toaster />
      </>
    );
  }

  // Show login page
  if (!currentUser) {
    return (
      <>
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setShowRegistration(true)} 
        />
        <Toaster />
      </>
    );
  }

  // Show admin dashboard
  if (currentUser.type === 'admin') {
    return (
      <>
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Show user dashboard
  return (
    <>
      <EnhancedUserDashboard user={currentUser} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}
