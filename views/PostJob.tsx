import React, { useState } from 'react';
import { Job, JobType } from '../types';
import { generateJobDescription, autoFormatJob } from '../services/gemini';
import { Sparkles, Loader2, Save, PenTool, Link2, Image as ImageIcon, XCircle } from 'lucide-react';

interface PostJobProps {
  onPost: (job: Job) => void;
  onCancel: () => void;
}

export const PostJob: React.FC<PostJobProps> = ({ onPost, onCancel }) => {
  const [mode, setMode] = useState<'MANUAL' | 'IMPORT'>('MANUAL');
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Import Mode State
  const [rawText, setRawText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: JobType.FULL_TIME,
    salaryRange: '',
    description: '',
    requirements: '',
    applyLink: '',
    deadline: '',
    imageUrl: ''
  });

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.company) {
      setAiError("Please enter a job title and company first.");
      return;
    }
    setLoading(true);
    setAiError(null);
    try {
      const desc = await generateJobDescription(
        formData.title,
        formData.company,
        formData.requirements || "Standard industry requirements"
      );
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (err) {
      setAiError("Failed to generate description. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFormat = async () => {
    if (!rawText.trim()) {
      setAiError("Please paste some job text to process.");
      return;
    }
    setLoading(true);
    setAiError(null);
    try {
      const result = await autoFormatJob(rawText);

      setFormData({
        title: result.title || formData.title,
        company: result.company || formData.company,
        location: result.location || formData.location,
        type: (result.type as JobType) || formData.type,
        salaryRange: result.salary || formData.salaryRange,
        description: result.description,
        requirements: result.requirements.join(', '),
        applyLink: result.applyLink || formData.applyLink,
        deadline: result.deadline || formData.deadline,
        imageUrl: result.imageUrl || formData.imageUrl
      });
      setMode('MANUAL'); // Switch to form view to review
    } catch (err) {
      setAiError("Failed to process. Ensure the text contains valid job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      postedAt: Date.now(),
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean)
    };
    onPost(newJob);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setMode('MANUAL')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'MANUAL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Manual Entry
           </button>
           <button 
             onClick={() => setMode('IMPORT')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'IMPORT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             AI Auto-Import
           </button>
        </div>
      </div>

      {mode === 'IMPORT' ? (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Paste & Process</h2>
              <p className="text-slate-500 text-sm">Paste a messy job post below, and we'll format it instantly.</p>
            </div>
          </div>
          
          <textarea
            className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 text-slate-800 placeholder-slate-400 resize-none font-mono text-sm"
            placeholder="Paste raw text here (e.g., from an email, WhatsApp, or another site)..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />

          {aiError && (
             <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
               <XCircle className="h-4 w-4 mr-2" />
               {aiError}
             </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAutoFormat}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
              {loading ? 'Processing...' : 'Auto-Format with AI'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                 <input
                   required
                   type="text"
                   className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                   placeholder="e.g. Senior Product Designer"
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                 <input
                   required
                   type="text"
                   className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                   placeholder="e.g. Acme Corp"
                   value={formData.company}
                   onChange={e => setFormData({...formData, company: e.target.value})}
                 />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                 <input
                   required
                   type="text"
                   className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                   placeholder="e.g. Remote, New York"
                   value={formData.location}
                   onChange={e => setFormData({...formData, location: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                 <select
                   className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value as JobType})}
                 >
                   {Object.values(JobType).map(t => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                 <input
                   required
                   type="text"
                   className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                   placeholder="e.g. $80k - $100k"
                   value={formData.salaryRange}
                   onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                 />
               </div>
             </div>
             
             {/* Image URL Section - Reverted to simple URL input */}
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Image URL (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    className="w-full rounded-lg border-slate-300 border pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="https://example.com/poster.jpg"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Job Preview" 
                      className="max-h-48 rounded-lg border border-slate-200 shadow-sm object-contain bg-slate-50"
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  </div>
                )}
             </div>

             <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-slate-700">Job Description</label>
                 <button 
                   type="button"
                   onClick={handleGenerateDescription}
                   disabled={loading}
                   className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2 py-1 rounded transition-colors"
                 >
                   {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <PenTool className="h-3 w-3 mr-1" />}
                   Generate with AI
                 </button>
               </div>
               <textarea
                 required
                 rows={6}
                 className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (comma separated)</label>
               <textarea
                 required
                 rows={3}
                 className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                 placeholder="e.g. React, Node.js, Team Player"
                 value={formData.requirements}
                 onChange={e => setFormData({...formData, requirements: e.target.value})}
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Application Link / Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      required
                      type="text"
                      className="w-full rounded-lg border-slate-300 border pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="https://... or mailto:..."
                      value={formData.applyLink}
                      onChange={e => setFormData({...formData, applyLink: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deadline (Optional)</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="YYYY-MM-DD"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
               </div>
             </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Post Job
            </button>
          </div>
        </form>
      )}
    </div>
  );
};