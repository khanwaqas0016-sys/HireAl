import React from 'react';
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={() => onClick(job.id)}
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 flex items-center mt-1">
              <Building2 className="h-3 w-3 mr-1" />
              {job.company}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {job.type}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
            {job.salaryRange}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-2 text-slate-400" />
            Posted {new Date(job.postedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
         <span className="text-xs text-slate-400">View Details</span>
         <span className="text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">Apply &rarr;</span>
      </div>
    </div>
  );
};
