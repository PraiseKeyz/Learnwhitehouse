import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChatOverlay from "../components/ChatOverlay";
import axios from 'axios';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<any>(null);


  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const isActiveRoute = (path: string) => {
    return location.pathname === path ? 'bg-[#C62828] text-white' : 'text-gray-300 hover:bg-[#E53935] hover:text-white';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/auth/user-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 bg-white rounded-lg shadow-md ${isSidebarOpen? 'hidden' : 'block'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#263238]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black-100 bg-opacity-100 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#263238] z-40
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-64' : (isSidebarOpen ? 'w-64' : 'w-20')}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-white font-bold ${!isSidebarOpen && !isMobile ? 'hidden' : 'block'}`}>
            LearnWhitehouse
          </h1>
          {isSidebarOpen && isMobile && (
            <button onClick={() => setIsSidebarOpen(false)}  className="text-white p-2 hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {[
            { path: '/dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { path: '/dashboard/courses', name: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { path: '/dashboard/quiz', name: 'Practice', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { path: '/dashboard/performance', name: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { path: '/dashboard/profile', name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActiveRoute(item.path)}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {(isSidebarOpen || isMobile) && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-20')}
      `}>
        {/* Header */}
        <div className={`
          fixed top-0 right-0 bg-white border-b border-gray-200 h-16
          transition-all duration-300
          ${isMobile ? 'left-0' : (isSidebarOpen ? 'left-64' : 'left-20')} // Dynamically sets left offset
          ${isMobile ? 'pl-16 pr-4 sm:pr-6' : 'px-8'} // Dynamically sets padding: more left padding on mobile to clear menu icon, less right padding for content space. Desktop uses symmetrical padding.
          flex items-center justify-between z-20
        `}>
          <div className="flex items-center space-x-4">
            {/* Added optional chaining for user properties */}
            <h2 className="text-xl font-semibold text-[#263238] truncate">Welcome, {user?.firstname} {user?.surname}</h2>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted spacing for smaller screens */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Added optional chaining for user properties */}
            <div className="h-8 w-8 rounded-full bg-[#C62828] flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#E53935] transition-colors flex-shrink-0">
              {user?.firstname?.[0] || ''}{user?.surname?.[0] || ''}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16 p-8">
          <Outlet />
        </div>

        {/* Chat Overlay */}
        <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#C62828] hover:bg-[#E53935] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Overlay Component */}
      {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;