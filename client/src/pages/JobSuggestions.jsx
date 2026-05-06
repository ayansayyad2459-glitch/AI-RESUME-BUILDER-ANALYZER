import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { ExternalLink, Search, Briefcase } from 'lucide-react';

export default function JobSuggestions() {
  const { resumeId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activePlatform, setActivePlatform] = useState('All');

  useEffect(() => {
    if (resumeId) loadResumeJobs();
  }, [resumeId]);

  const loadResumeJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/resume/${resumeId}`);
      setJobs(data.jobSuggestions || []);
    } catch (err) {
      toast.error('Failed to load job suggestions');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return toast.error('Enter a job title to search');
    setLoading(true);
    try {
      const { data } = await api.get(`/api/jobs/search?q=${searchQuery}&location=${searchLocation}`);
      setSearchResults(data);
    } catch (err) {
      toast.error('Search failed');
    }
    setLoading(false);
  };

  const platforms = ['All', ...new Set(jobs.map(j => j.platform))];
  const filtered = activePlatform === 'All' ? jobs : jobs.filter(j => j.platform === activePlatform);
  const displayJobs = searchResults.length > 0 ? searchResults : filtered;

  return (
    <div className="jobs-page">
      <h1>💼 Job Suggestions</h1>
      <p>{resumeId ? 'Jobs matched to your resume skills' : 'Search for jobs across multiple platforms'}</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input className="form-input" placeholder="Job title, e.g. React Developer"
            style={{ flex: 2, minWidth: '200px' }}
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <input className="form-input" placeholder="Location (optional)"
            style={{ flex: 1, minWidth: '150px' }}
            value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
            <Search size={16} /> Search
          </button>
        </div>
      </div>

      {jobs.length > 0 && searchResults.length === 0 && (
        <div className="jobs-filters">
          {platforms.map(p => (
            <button key={p} className={`filter-btn ${activePlatform === p ? 'active' : ''}`}
              onClick={() => setActivePlatform(p)}>{p}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state"><div className="spinner"></div></div>
      ) : displayJobs.length > 0 ? (
        <div className="jobs-grid">
          {(searchResults.length > 0 ? searchResults : displayJobs).map((job, i) => (
            <div key={i} className="card job-card">
              <h3>{job.title || searchQuery}</h3>
              <div className="job-meta">
                {job.company || job.platform} • {job.location || 'Remote/Multiple'}
              </div>
              <span className="job-platform">{job.platform || job.icon}</span>
              {job.matchScore > 0 && (
                <span className="job-match" style={{ color: job.matchScore > 50 ? 'var(--success)' : 'var(--warning)' }}>
                  {job.matchScore}% match
                </span>
              )}
              <br />
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="job-link">
                View on {job.platform} <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <Briefcase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No jobs to display</h3>
          <p>{resumeId ? 'Try analyzing a resume with more skills' : 'Search for a job title to see results across platforms'}</p>
        </div>
      )}
    </div>
  );
}
