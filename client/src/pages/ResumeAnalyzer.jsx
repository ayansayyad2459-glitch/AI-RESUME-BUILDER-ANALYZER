import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Upload, FileText, Zap, Target, AlertTriangle, Lightbulb, Award, ArrowRight } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') setFile(f);
    else toast.error('Only PDF files allowed');
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please select a PDF file');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    }
    setLoading(false);
  };

  const scoreDeg = result ? (result.analysis.overallScore / 100) * 360 : 0;

  return (
    <div className="analyzer-page">
      {loading && (
        <div className="loading-overlay">
          <div className="pulse-loader"></div>
          <div className="loading-text">Analyzing your resume with AI...</div>
        </div>
      )}

      <h1>📄 AI Resume Analyzer</h1>
      <p>Upload your resume PDF and get instant AI-powered insights</p>

      {!result && (
        <>
          <div
            className={`upload-zone`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} />
            <div className="upload-icon">📁</div>
            <h3>Drag & drop your resume here</h3>
            <p>or click to browse • PDF files only • Max 5MB</p>
            {file && <div className="file-name">📎 {file.name}</div>}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={handleAnalyze} className="btn btn-primary btn-lg" disabled={!file || loading}>
              <Zap size={18} /> Analyze Resume
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="analysis-results">
          <div className="score-circle" style={{ '--score-deg': `${scoreDeg}deg` }}>
            <div className="score-value">{result.analysis.overallScore}</div>
          </div>
          <div className="score-label">
            Overall Score • Best match: <strong>{result.analysis.categoryMatch}</strong>
          </div>

          <div className="analysis-grid">
            <div className="card analysis-card">
              <h3><Target size={18} /> Skills Found ({result.analysis.skills.length})</h3>
              <div>{result.analysis.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}</div>
            </div>

            <div className="card analysis-card">
              <h3><Award size={18} /> Experience</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {result.analysis.experience.years} years • {result.analysis.experience.level}
              </p>
              {result.analysis.education.length > 0 && (
                <>
                  <h3 style={{ marginTop: '1rem' }}><FileText size={18} /> Education</h3>
                  <div>{result.analysis.education.map((e, i) => <span key={i} className="tag green">{e}</span>)}</div>
                </>
              )}
            </div>

            <div className="card analysis-card">
              <h3><Zap size={18} style={{ color: 'var(--success)' }} /> Strengths</h3>
              {result.analysis.strengths.map((s, i) => (
                <div key={i} className="list-item"><div className="list-bullet green"></div>{s}</div>
              ))}
              {result.analysis.strengths.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add more achievements to show strengths</p>
              )}
            </div>

            <div className="card analysis-card">
              <h3><AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Areas to Improve</h3>
              {result.analysis.weaknesses.map((w, i) => (
                <div key={i} className="list-item"><div className="list-bullet orange"></div>{w}</div>
              ))}
            </div>

            <div className="card analysis-card" style={{ gridColumn: '1 / -1' }}>
              <h3><Lightbulb size={18} style={{ color: 'var(--accent-secondary)' }} /> Suggestions</h3>
              {result.analysis.suggestions.map((s, i) => (
                <div key={i} className="list-item"><div className="list-bullet"></div>{s}</div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate(`/jobs/${result._id}`)} className="btn btn-primary btn-lg">
              View Job Suggestions <ArrowRight size={18} />
            </button>
            <button onClick={() => { setResult(null); setFile(null); }} className="btn btn-secondary btn-lg">
              Analyze Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
