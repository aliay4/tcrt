"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ToastContainer from "@/components/ToastContainer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to load
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/auth/login?redirect=/admin');
      } else if (!isAdmin) {
        // Logged in but not admin, redirect to home
        router.push('/');
      } else {
        // User is admin, allow access
        setIsChecking(false);
      }
    }
  }, [user, isAdmin, loading, router]);

  // Show loading while checking
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Only render admin content if user is admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <ToastContainer />
    </div>
  );
}
