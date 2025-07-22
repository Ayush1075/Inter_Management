import { Briefcase, User, Users } from "lucide-react";

const BatchCard = ({ batch, onCardClick }) => {
  const mentors = batch.users.filter(u => u.role === 'MENTOR');
  const interns = batch.users.filter(u => u.role === 'INTERN');

  return (
    <div 
      onClick={() => onCardClick(batch)}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow h-full cursor-pointer"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{batch.name}</h3>
        </div>
      </div>

      {/* Mentors Section */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-5 w-5 text-gray-500" />
          <h4 className="text-md font-semibold text-gray-700">Mentors ({mentors.length})</h4>
        </div>
        <div className="space-y-2 pl-7">
          {mentors.map(mentor => (
            <div key={mentor._id} className="text-sm text-gray-600">{mentor.name} ({mentor.email})</div>
          ))}
          {mentors.length === 0 && <p className="text-sm text-gray-500">No mentors assigned.</p>}
        </div>
      </div>

      {/* Interns Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h4 className="text-md font-semibold text-gray-700">Interns ({interns.length})</h4>
        </div>
        <div className="space-y-2 pl-7">
          {interns.map(intern => (
            <div key={intern._id} className="text-sm text-gray-600">{intern.name} ({intern.email})</div>
          ))}
          {interns.length === 0 && <p className="text-sm text-gray-500">No interns assigned.</p>}
        </div>
      </div>
    </div>
  );
};

export default BatchCard; 