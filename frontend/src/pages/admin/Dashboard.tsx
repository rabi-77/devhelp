import { Construction } from "lucide-react";
const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
      </div>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
            <Construction className="h-10 w-10 text-[#562182]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 max-w-md">
            We're working hard to bring you an amazing dashboard experience.
            Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
