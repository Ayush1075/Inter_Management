import { Users, Activity, TrendingUp, Award } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <p className="text-sm text-green-600 mt-1">
      {trend ? <span>+{trend}% from last month</span> : <span>&nbsp;</span>}
    </p>
  </div>
);

export default StatCard; 