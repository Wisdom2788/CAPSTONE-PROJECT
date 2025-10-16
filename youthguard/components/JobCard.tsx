import React from 'react';
import { motion } from 'framer-motion';
import { Job } from '../types';
import { BriefcaseIcon } from './icons';

interface JobCardProps {
  job: Job;
  onEdit?: (id: string) => void;
}

const jobTypeColorMap = {
    'Full-time': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Part-time': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Contract': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Internship': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const JobCard: React.FC<JobCardProps> = (props) => {
  const { job, onEdit } = props;
  return (
    <motion.div 
      className="card card-hover p-4 sm:p-6 hover-lift"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 dark:bg-gray-700"
        >
            <BriefcaseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary"/>
        </motion.div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-text-primary">{job.title}</h3>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">{job.company}</p>
            </div>
            <span className={`mt-1 sm:mt-0 px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold rounded-full ${jobTypeColorMap[job.jobType]}`}>{job.jobType}</span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 sm:mt-2">{job.location}</p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1 sm:gap-2">
                {job.skills.slice(0, 3).map((skill, index) => (
                    <motion.span 
                      key={skill} 
                      whileHover={{ scale: 1.1 }}
                      className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-gray-200 text-text-secondary rounded-md transition-all duration-300 hover:bg-primary hover:text-white dark:bg-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </motion.span>
                ))}
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {onEdit && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(job._id)}
                  className="text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </motion.button>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs sm:text-sm font-semibold text-primary hover:text-blue-700 transition-colors hover-lift dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Details &rarr;
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;