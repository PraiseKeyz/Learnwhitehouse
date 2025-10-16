import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const DashboardOverview = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Dummy data for demonstration
  const examDates = [
    { subject: "CHM102", date: "2025-05-15", type: "Mid-Semester" },
    { subject: "PHY102", date: "2025-05-20", type: "Mid-Semester" },
  ];

  const getTimeUntil = (dateString: string) => {
    const difference = new Date(dateString).getTime() - new Date().getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#263238] mb-2">Welcome back, {user?.firstname}!</h1>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{user?.department} department</p>
            <p className="text-sm text-gray-500">{user?.currentLevel} • Second Semester</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-[#fef2f2] rounded-lg">
          <p className="text-sm text-[#C62828]">
            <span className="font-semibold">Today's Tip:</span> Understanding electron configuration? Remember the Aufbau principle: electrons fill orbitals from lowest to highest energy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#263238] text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered</span>
              <span className="text-[#C62828] font-semibold">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accuracy Rate</span>
              <span className="text-[#C62828] font-semibold">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lab Attendance</span>
              <span className="text-[#C62828] font-semibold">12/15</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#263238] text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/dashboard/quiz" className="block">
              <button className="w-full bg-[#C62828] text-white px-4 py-2 rounded-lg hover:bg-[#E53935] transition-colors">
                Start New Practice
              </button>
            </Link>
            <button className="w-full border-2 border-[#C62828] text-[#C62828] px-4 py-2 rounded-lg hover:bg-[#fef2f2] transition-colors">
              Resume Last Course
            </button>
            <Link to="/dashboard/courses" className="block">
              <button className="w-full border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                View All Courses
              </button>
            </Link>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#263238] text-lg font-semibold mb-4">Need Help?</h3>
          <div className="text-center p-4 bg-gradient-to-br from-[#fef2f2] to-white rounded-lg">
            <div className="w-16 h-16 mx-auto mb-3 bg-[#C62828] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-[#263238] mb-2">Ask Electron</h4>
            <p className="text-sm text-gray-600 mb-4">Your AI study buddy for chemistry concepts</p>
            <Link to='/'>
            <button className="w-full bg-[#C62828] text-white px-4 py-2 rounded-lg hover:bg-[#E53935] transition-colors">
              Start Conversation
            </button>
            </Link>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 lg:col-span-3">
          <h3 className="text-[#263238] text-lg font-semibold mb-4">Upcoming Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examDates.map((exam, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-[#C62828]">{exam.subject}</h4>
                    <p className="text-sm text-gray-600">{exam.type}</p>
                  </div>
                  <span className="text-sm font-semibold bg-[#fef2f2] text-[#C62828] px-2 py-1 rounded">
                    {getTimeUntil(exam.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{new Date(exam.date).toLocaleDateString()}</p>
              </div>
            ))}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">More exam dates will be announced soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;