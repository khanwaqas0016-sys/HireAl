import React, { useState } from 'react';
import { Job, Application } from '../types';
import { generateCoverLetter } from '../services/gemini';
import { Sparkles, Loader2, Send, ArrowLeft } from 'lucide-react';

interface ApplyJobProps {
  job: Job;
  onApply: (app: Application) => void;
  onCancel: () => void;
}

export const ApplyJob: React.FC<ApplyJobProps> = ({ job, onApply, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    coverLetter: ''
  });

  const handleGenerateCoverLetter = async () => {
    if (!formData.name || !formData.skills) {
      alert("Please fill in your name and skills first.");
      return;
    }
    setLoading(true);
    try {
      const letter = await generateCoverLetter(
        job.title,
        job.company,
        formData.name,
        formData.skills
      );
      setFormData(prev => ({ ...prev, coverLetter: letter }));
    } catch (err) {
      alert("Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      jobId: job.id,
      applicantName: formData.name,
      email: formData.email,
      coverLetter: formData.coverLetter
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onCancel} className="mb-4 flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to details
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-indigo-600 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
          <p className="opacity-90">{job.company}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Your Core Skills</label>
             <input
                required
                type="text"
                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. React, Project Management, Sales"
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
              />
              <p className="text-xs text-slate-500 mt-1">Used to personalize your cover letter.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700">Cover Letter</label>
              <button
                type="button"
                onClick={handleGenerateCoverLetter}
                disabled={loading}
                className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                <span>Write with AI</span>
              </button>
            </div>
            <textarea
              required
              rows={6}
              className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              value={formData.coverLetter}
              onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Generate with AI or write your own..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
