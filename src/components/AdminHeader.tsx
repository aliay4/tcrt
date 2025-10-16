"use client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  sidebarOpen, 
  setSidebarOpen, 
  children 
}: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-orange-600 transition-colors duration-300 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center bg-gray-50 rounded-lg p-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-800">Yönetici</p>
              <p className="text-xs text-gray-500">Yönetici</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
