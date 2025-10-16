import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProfile {
  name: string;
  department: string;
  matricNumber: string;
  level: string;
  email: string;
  phone: string;
  avatar: string;
  enrolledCourses: string[];
  learningGoals: string[];
  achievements: {
    title: string;
    description: string;
    date: string;
    icon: string;
  }[];
  badges: {
    name: string;
    icon: string;
    earned: boolean;
  }[];
}

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Profile = () => {
  // Dummy data
  const [profile] = useState<UserProfile>({
    name: "Praise Adebayo",
    department: "Chemistry",
    matricNumber: "CHM/2023/001",
    level: "100",
    email: "praise.adebayo@example.com",
    phone: "+234 123 456 7890",
    avatar: "PA",
    enrolledCourses: ["CHM101", "PHY102", "BIO101"],
    learningGoals: [
      "Master organic chemistry fundamentals",
      "Complete all practice tests with 80% accuracy",
      "Understand chemical bonding concepts thoroughly"
    ],
    achievements: [
      {
        title: "Quick Learner",
        description: "Completed 10 practice tests in one week",
        date: "2024-01-15",
        icon: "🎯"
      },
      {
        title: "Chemistry Enthusiast",
        description: "Spent 20 hours studying chemistry",
        date: "2024-01-10",
        icon: "⚗️"
      }
    ],
    badges: [
      {
        name: "Perfect Score",
        icon: "🏆",
        earned: true
      },
      {
        name: "Study Streak",
        icon: "🔥",
        earned: true
      },
      {
        name: "Chemistry Master",
        icon: "🧪",
        earned: false
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState<any>(null);


  const API_BASE_URL = import.meta.env.VITE_APP_API_URL
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

  return (
    <div className="p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 text-center sm:text-left">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#C62828] flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0">
            {user?.firstname[0] + user?.surname[0]}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#263238]">{user?.firstname} {user?.surname}</h1>
            <p className="text-gray-600">{user?.department} Department</p>
            <p className="text-gray-500 text-sm">Level: {user?.currentLevel}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max">
          {['personal', 'academic', 'settings', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#C62828] text-[#C62828]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {activeTab === 'academic' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#263238] mb-4 sm:mb-6">Enrolled Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {profile.enrolledCourses.map((course) => (
                    <div key={course} className="p-3 sm:p-4 border rounded-lg hover:border-[#C62828] transition-colors">
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

{activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#263238] mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                  <button className="px-4 py-2 bg-[#C62828] text-white rounded-lg hover:bg-[#E53935] transition-colors">
                    Update Password
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-[#C62828]" />
                      <span className="ml-2 text-gray-600">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-[#C62828]" />
                      <span className="ml-2 text-gray-600">Practice reminders</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#263238] mb-4 sm:mb-6">Badges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {profile.badges.map((badge, index) => (
                    <div key={index} className={`p-3 sm:p-4 border rounded-lg text-center ${
                      badge.earned ? 'border-[#C62828]' : 'border-gray-200 opacity-50'
                    }`}>
                      <span className="text-2xl sm:text-3xl mb-2 block">{badge.icon}</span>
                      <h3 className="font-semibold text-sm sm:text-base text-[#263238]">{badge.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {badge.earned ? 'Earned' : 'Locked'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#263238] mb-3 sm:mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Practice Sessions</span>
                <span className="font-semibold text-[#263238]">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Study Streak</span>
                <span className="font-semibold text-[#263238]">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Answered</span>
                <span className="font-semibold text-[#263238]">245</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;