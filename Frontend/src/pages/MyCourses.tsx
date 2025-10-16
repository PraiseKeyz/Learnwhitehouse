import { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
    id: string;
    code: string;
    title: string;
    coordinator: string;
    description: string;
  }

const MyCourses = () => {
    const courses = [
        {
            id: "1",
            code: "CHM101",
            title: "General Chemistry",
            coordinator: "Dr. Sarah Johnson",
            description: "An introduction to fundamental chemical principles, including atomic structure, chemical bonding, periodic trends, stoichiometry, gases, thermochemistry and solutions. This course provides a foundation for further studies in chemistry and related sciences, emphasizing both theoretical concepts and practical applications in everyday life and industrial processes."
          },
          {
            id: "2",
            code: "PHY102",
            title: "Classical Physics",
            coordinator: "Prof. Michael Chen",
            description: "A comprehensive study of classical mechanics, including Newton's laws of motion, conservation laws, rotational dynamics, and waves. The course covers fundamental principles that govern the physical world, from simple motion to complex mechanical systems, providing essential knowledge for engineering and physical sciences."
          },
          {
            id: "3",
            code: "BIO101",
            title: "Introduction to Biology",
            coordinator: "Dr. Emily Rodriguez",
            description: "Explore the fundamentals of life sciences, covering cell biology, genetics, evolution, and basic ecological principles. This course introduces students to the fascinating world of living organisms, from microscopic cellular processes to complex ecosystems."
          }
    ];
    const [ selectedCourse, setSelectedCourse ] = useState<Course | null>(null);
    const [user, setUser] = useState<any>(null);
    const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

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

    // convert current level to string
    const getYearFromLevel = (level: number | undefined | null): string => {
      if (!level) return "N/A";
      const levelStr = level.toString();
      if (levelStr.startsWith('1')) return "first year";
      if (levelStr.startsWith('2')) return "second year";
      if (levelStr.startsWith('3')) return "third year";
      if (levelStr.startsWith('4')) return "fourth year";
      if (levelStr.startsWith('5')) return "fifth year";
      return `${levelStr} level`; 
    };

  return (
    <div className='p-8'>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#263238] mb-3">My Courses</h1>
        <div className="bg-white p-6 rounded-lg border-l-4 border-[#C62828] shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-xl font-semibold text-[#263238]">Department of Chemistry</h2>
          </div>
          <p className="text-gray-600">Welcome to your {getYearFromLevel(user?.currentLevel)}! You're currently enrolled in fundamental chemistry courses that will build your foundation in chemical sciences.</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span className="mr-4">Level: {user?.currentLevel || 'N/A'}</span>
            <span className="mr-4">•</span>
            <span>Semester: Second Semester</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100                      transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#C62828]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[#C62828]">{course.code}</span>
                <span className="text-xs text-gray-500">4 Credits</span>
              </div>
              
              <h2 className="text-xl font-semibold text-[#263238] mb-2">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                Coordinator: {course.coordinator}
              </p>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              <button
                onClick={() => setSelectedCourse(course)}
                className="text-[#C62828] text-sm font-semibold hover:text-[#E53935] transition-colors"
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-[#C62828] mb-2">{selectedCourse.code}</p>
                <h2 className="text-2xl font-bold text-[#263238]">{selectedCourse.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Coordinator: {selectedCourse.coordinator}
            </p>
            
            <p className="text-gray-600">
              {selectedCourse.description}
            </p>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-[#C62828] text-white rounded hover:bg-[#E53935] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCourses;