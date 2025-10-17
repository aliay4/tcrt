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
      <div className="flex items-center justify-between p-4 md:p-6">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm font-semibold text-gray-600 mt-1 hidden sm:block">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
              A
            </div>
            <div className="ml-2 md:ml-3 hidden sm:block">
              <p className="text-xs md:text-sm font-semibold text-gray-800">Yönetici</p>
              <p className="text-xs text-gray-500">Yönetici</p>
            </div>
          </div>
          <div className="hidden md:block">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
