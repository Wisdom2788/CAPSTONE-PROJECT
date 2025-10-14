
import React from 'react';
import { Course } from '../types';
import { ClockIcon, LevelIcon, StarIcon } from './icons';

interface CourseCardProps {
  course: Course;
}

const difficultyColorMap = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img className="h-48 w-full object-cover" src={course.thumbnail} alt={course.title} />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-primary font-medium mb-1">{course.category}</p>
          <h3 className="text-lg font-bold font-heading text-text-primary mb-2 h-14">{course.title}</h3>
          <p className="text-sm text-text-secondary mb-4">by {course.instructor}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-text-secondary mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-5 w-5 text-accent" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-5 w-5" />
            <span>{course.duration} hrs</span>
          </div>
           <div className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColorMap[course.difficulty]}`}>
            {course.difficulty}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
