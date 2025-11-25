import React, { useState } from 'react';
import { searchJobs, SearchResult } from '../services/gemini';
import { Search, Loader2, ExternalLink, Globe } from 'lucide-react';

export const JobDiscovery: React.FC = () => {
  const [query, setQuery] = useState('Government and Private jobs in Pakistan');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await searchJobs(query);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch jobs. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Discover Jobs with Google Search
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Search for the latest openings across the web.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
              placeholder="e.g. site:jobz.pk software engineer"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 flex items-center min-w-[120px] justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 animate-pulse">Scanning the web for opportunities...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100 flex items-center">
              <Globe className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-bold text-indigo-900">AI Summary</h2>
            </div>
            <div className="p-6 prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result.summary}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Found Sources</h3>
              <div className="grid grid-cols-1 gap-4">
                {result.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group gap-4"
                  >
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-slate-900 line-clamp-1">
                        {source.title}
                      </h4>
                      <a 
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:underline flex items-center mt-1 truncate"
                      >
                        {source.uri} <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {result.sources.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No direct sources found. Try adjusting your search query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};