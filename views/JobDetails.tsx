import React from 'react';
import { Job } from '../types';
import { MapPin, Building2, Clock, DollarSign, ArrowLeft, CheckCircle2, ExternalLink, Calendar } from 'lucide-react';

interface JobDetailsProps {
  job: Job;
  onApply: () => void;
  onBack: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job, onApply, onBack }) => {
  const handleApplyClick = () => {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      onApply();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Job Image Banner */}
        {job.imageUrl && (
          <div className="w-full bg-slate-100 border-b border-slate-100 flex justify-center">
             <img 
               src={job.imageUrl} 
               alt={`${job.title} Poster`} 
               className="max-h-[400px] w-auto object-contain py-4"
             />
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {job.type}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center text-slate-500 space-y-2 sm:space-y-0 sm:space-x-6 text-sm font-medium">
              <span className="flex items-center"><Building2 className="h-4 w-4 mr-1.5" /> {job.company}</span>
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {job.location}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> Posted {new Date(job.postedAt).toLocaleDateString()}</span>
              {job.deadline && job.deadline.trim() !== '' && (
                <span className="flex items-center text-red-500"><Calendar className="h-4 w-4 mr-1.5" /> Deadline: {job.deadline}</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
             <div className="text-lg font-bold text-slate-900 mb-2 md:text-right">{job.salaryRange}</div>
             <button
               onClick={handleApplyClick}
               className="group relative w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-400 hover:-translate-y-1 active:translate-y-0 overflow-hidden flex items-center justify-center space-x-2"
             >
               <span className="relative z-10">{job.applyLink ? 'Apply on Company Site' : 'Apply Now'}</span>
               {job.applyLink && <ExternalLink className="h-4 w-4 relative z-10" />}
               <div className="absolute inset-0 h-full w-full bg-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
              <div className="prose prose-slate text-slate-600 max-w-none whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Requirements</h3>
               <ul className="space-y-3">
                 {job.requirements.map((req, idx) => (
                   <li key={idx} className="flex items-start text-sm text-slate-600">
                     <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                     <span>{req}</span>
                   </li>
                 ))}
               </ul>
             </div>

             {!job.applyLink && (
               <div className="bg-indigo-900 p-6 rounded-xl text-white relative overflow-hidden">
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full pointer-events-none"></div>
                  
                  <h3 className="font-bold mb-2 relative z-10">Interested?</h3>
                  <p className="text-indigo-200 text-sm mb-4 relative z-10">
                    Use our AI assistant to write a perfect cover letter in seconds.
                  </p>
                  <button 
                    onClick={onApply}
                    className="w-full py-2 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-indigo-50 transition-colors relative z-10 shadow-sm hover:shadow-md"
                  >
                    Start Application
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};