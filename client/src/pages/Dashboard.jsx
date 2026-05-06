import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FileSearch, FilePlus, Briefcase, Trash2, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/api/resume');
      setResumes(data);
    } catch (err) {
      toast.error('Failed to load resumes');
    }
    setLoading(false);
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/api/resume/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-mid';
    return 'score-low';
  };

  const analyzed = resumes.filter(r => r.analysis?.overallScore > 0);
  const avgScore = analyzed.length
    ? Math.round(analyzed.reduce((sum, r) => sum + r.analysis.overallScore, 0) / analyzed.length)
    : 0;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Manage your resumes and explore job opportunities</p>
      </div>

      <div className="dash-stats">
        <div className="card stat-card">
          <div className="stat-number">{resumes.length}</div>
          <div className="stat-label">Total Resumes</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{analyzed.length}</div>
          <div className="stat-label">Analyzed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{avgScore}%</div>
          <div className="stat-label">Avg Score</div>
        </div>
      </div>

      <div className="dash-actions">
        <div className="card action-card" onClick={() => navigate('/analyze')}>
          <FileSearch size={28} style={{ color: '#6c63ff', marginBottom: '0.5rem' }} />
          <h3>Analyze Resume</h3>
          <p>Upload & get AI-powered analysis with job suggestions</p>
        </div>
        <div className="card action-card" onClick={() => navigate('/builder')}>
          <FilePlus size={28} style={{ color: '#00d2ff', marginBottom: '0.5rem' }} />
          <h3>Build Resume</h3>
          <p>Create a professional resume and export as PDF</p>
        </div>
        <div className="card action-card" onClick={() => navigate('/jobs')}>
          <Briefcase size={28} style={{ color: '#00e676', marginBottom: '0.5rem' }} />
          <h3>Browse Jobs</h3>
          <p>Search jobs on LinkedIn, Indeed, Glassdoor & more</p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Resumes</h2>
        {loading ? (
          <div className="empty-state"><div className="spinner"></div></div>
        ) : resumes.length === 0 ? (
          <div className="card empty-state">
            <h3>No resumes yet</h3>
            <p>Upload or build your first resume to get started</p>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.slice(0, 8).map((r) => (
              <div key={r._id} className="card resume-item">
                <div className="resume-item-info">
                  <h4>{r.fileName}</h4>
                  <p>{new Date(r.createdAt).toLocaleDateString()} • {r.analysis?.categoryMatch || 'Resume'}</p>
                </div>
                <div className="resume-item-actions">
                  {r.analysis?.overallScore > 0 && (
                    <span className={`score-badge ${getScoreClass(r.analysis.overallScore)}`}>
                      {r.analysis.overallScore}%
                    </span>
                  )}
                  {r.jobSuggestions?.length > 0 && (
                    <Link to={`/jobs/${r._id}`} className="btn btn-sm btn-secondary">
                      <ExternalLink size={14} /> Jobs
                    </Link>
                  )}
                  <button onClick={() => deleteResume(r._id)} className="btn btn-sm btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
