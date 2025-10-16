import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Performance = () => {
  // Dummy data for demonstration
  const performanceData = {
    overallScore: 78,
    questionsAttempted: 245,
    accuracyRate: 72,
    studyTime: "32h 45m",
    recentTests: [65, 72, 78, 75, 82, 80],
    coursePerformance: [
      { course: "CHM101", score: 78, average: 72 },
      { course: "PHY102", score: 65, average: 68 },
      { course: "BIO101", score: 82, average: 75 }
    ],
    topicMastery: {
      labels: [
        'Atomic Structure',
        'Chemical Bonding',
        'Stoichiometry',
        'Thermodynamics',
        'Solutions',
        'Kinetics'
      ],
      data: [85, 65, 72, 78, 82, 70]
    }
  };

  return (
    <div className="p-8">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#263238] mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Overall Score</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-[#C62828]">{performanceData.overallScore}%</span>
              <span className="text-green-500 text-sm mb-1">↑ 5%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Questions Attempted</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-[#C62828]">{performanceData.questionsAttempted}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Accuracy Rate</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-[#C62828]">{performanceData.accuracyRate}%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Study Time</h3>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-[#C62828]">{performanceData.studyTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#263238] mb-6">Course Performance</h3>
          <div className="space-y-4">
            {performanceData.coursePerformance.map((course) => (
              <div key={course.course} className="relative">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#263238]">{course.course}</span>
                  <span className="text-[#C62828]">{course.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-[#C62828] rounded-full"
                    style={{ width: `${course.score}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Class Average: {course.average}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#263238] mb-6">Topic Mastery</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Radar
              data={{
                labels: performanceData.topicMastery.labels,
                datasets: [
                  {
                    label: 'Your Mastery',
                    data: performanceData.topicMastery.data,
                    backgroundColor: 'rgba(198, 40, 40, 0.2)',
                    borderColor: '#C62828',
                    borderWidth: 2,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 },
                    pointLabels: {
                      font: {
                        size: 11
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;