import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { JobList } from './views/JobList';
import { PostJob } from './views/PostJob';
import { JobDetails } from './views/JobDetails';
import { ApplyJob } from './views/ApplyJob';
import { JobDiscovery } from './views/JobDiscovery';
import { Job, ViewState, Application, JobType } from './types';

// Mock Initial Data
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    location: 'Remote',
    type: JobType.FULL_TIME,
    salaryRange: '$140k - $180k',
    postedAt: Date.now() - 86400000 * 2,
    requirements: ['React', 'TypeScript', 'Tailwind', '5+ years exp'],
    description: `We are looking for a Senior Frontend Engineer to lead our core product team. You will be responsible for architecting scalable UI components and mentoring junior developers.
    
    Key Responsibilities:
    - Build pixel-perfect UIs using React and Tailwind.
    - optimize application performance.
    - Collaborate with product and design teams.`
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Creative Inc',
    location: 'New York, NY',
    type: JobType.FULL_TIME,
    salaryRange: '$110k - $150k',
    postedAt: Date.now() - 86400000,
    requirements: ['Figma', 'UX Research', 'Prototyping'],
    description: `Join our award-winning design team. We need someone with a keen eye for detail and a passion for user-centric design.`
  }
];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [view, setView] = useState<ViewState>({ type: 'LIST' });
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Load jobs from local storage on mount (simple persistence)
  useEffect(() => {
    const saved = localStorage.getItem('hireai_jobs');
    if (saved) {
      setJobs(JSON.parse(saved));
    }
  }, []);

  // Save jobs whenever they change
  useEffect(() => {
    localStorage.setItem('hireai_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePostJob = (job: Job) => {
    setJobs([job, ...jobs]);
    setView({ type: 'LIST' });
    showNotification('Job posted successfully!');
  };

  const handleApply = (app: Application) => {
    // In a real app, this would send to API
    console.log("Application received:", app);
    showNotification(`Application submitted to ${app.email}!`);
    setView({ type: 'LIST' });
  };

  const renderView = () => {
    switch (view.type) {
      case 'LIST':
        return <JobList jobs={jobs} onSelectJob={(id) => setView({ type: 'DETAILS', jobId: id })} />;
      case 'POST':
        return <PostJob onPost={handlePostJob} onCancel={() => setView({ type: 'LIST' })} />;
      case 'DETAILS':
        const job = jobs.find(j => j.id === view.jobId);
        if (!job) return <div>Job not found</div>;
        return (
          <JobDetails 
            job={job} 
            onApply={() => setView({ type: 'APPLY', jobId: job.id })} 
            onBack={() => setView({ type: 'LIST' })} 
          />
        );
      case 'APPLY':
        const jobToApply = jobs.find(j => j.id === view.jobId);
        if (!jobToApply) return <div>Job not found</div>;
        return (
          <ApplyJob 
            job={jobToApply} 
            onApply={handleApply} 
            onCancel={() => setView({ type: 'DETAILS', jobId: jobToApply.id })} 
          />
        );
      case 'DISCOVER':
        return <JobDiscovery />;
      default:
        return <JobList jobs={jobs} onSelectJob={(id) => setView({ type: 'DETAILS', jobId: id })} />;
    }
  };

  return (
    <Layout 
      onNavigateHome={() => setView({ type: 'LIST' })} 
      onNavigatePost={() => setView({ type: 'POST' })}
      onNavigateDiscover={() => setView({ type: 'DISCOVER' })}
    >
      {notification && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {notification.message}
        </div>
      )}
      {renderView()}
    </Layout>
  );
};

export default App;