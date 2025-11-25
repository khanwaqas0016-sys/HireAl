import React from 'react';
import { Briefcase, PlusCircle, Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome: () => void;
  onNavigatePost: () => void;
  onNavigateDiscover: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigateHome, onNavigatePost, onNavigateDiscover }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-indigo-900 tracking-tight">HireAI</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={onNavigateHome}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Local Jobs
              </button>
              <button 
                onClick={onNavigateDiscover}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <Globe className="h-4 w-4 mr-1.5" />
                <span className="hidden md:inline">Discover with AI</span>
                <span className="md:hidden">Discover</span>
              </button>
              <button
                onClick={onNavigatePost}
                className="group relative flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-shimmer" />
                <PlusCircle className="h-4 w-4 relative z-10" />
                <span className="relative z-10 hidden md:inline">Post a Job</span>
                <span className="relative z-10 md:hidden">Post</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} HireAI. Powered by Gemini.
        </div>
      </footer>
    </div>
  );
};