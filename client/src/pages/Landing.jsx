import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, FileSearch, FilePlus, Briefcase, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> AI-Powered Resume Platform
          </div>
          <h1 className="hero-title">
            Analyze, Build &<br />
            <span className="gradient">Land Your Dream Job</span>
          </h1>
          <p className="hero-desc">
            Upload your resume for AI analysis, get personalized job suggestions
            with direct links to LinkedIn, Indeed & more, or build a stunning resume from scratch.
          </p>
          <div className="hero-buttons">
            <Link to={user ? '/analyze' : '/register'} className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to={user ? '/builder' : '/login'} className="btn btn-outline btn-lg">
              Build Resume
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">Everything you need to land your next opportunity</p>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon"><FileSearch size={28} /></div>
            <h3>AI Resume Analysis</h3>
            <p>Upload your resume and get an instant AI-powered analysis with skill extraction, scoring, strengths, and improvement suggestions.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon"><Briefcase size={28} /></div>
            <h3>Smart Job Matching</h3>
            <p>Get personalized job suggestions based on your skills with direct links to LinkedIn, Indeed, Glassdoor, Naukri and more.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon"><FilePlus size={28} /></div>
            <h3>Resume Builder</h3>
            <p>Create professional resumes with our interactive builder. Choose from multiple templates and export as PDF instantly.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2024 ResumeAI. Built with MERN Stack. All rights reserved.</p>
      </footer>
    </div>
  );
}
