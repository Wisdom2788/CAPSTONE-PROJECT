
import React from 'react';
import { Job } from '../types';
import { BriefcaseIcon } from './icons';

interface JobCardProps {
  job: Job;
}

const jobTypeColorMap = {
    'Full-time': 'bg-blue-100 text-blue-800',
    'Part-time': 'bg-purple-100 text-purple-800',
    'Contract': 'bg-orange-100 text-orange-800',
    'Internship': 'bg-green-100 text-green-800'
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <BriefcaseIcon className="h-6 w-6 text-primary"/>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold font-heading text-text-primary">{job.title}</h3>
              <p className="text-sm text-text-secondary font-medium">{job.company}</p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${jobTypeColorMap[job.jobType]}`}>{job.jobType}</span>
          </div>
          <p className="text-sm text-text-secondary mt-2">{job.location}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-gray-200 text-text-secondary rounded-md">{skill}</span>
                ))}
            </div>
            <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
              View Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
