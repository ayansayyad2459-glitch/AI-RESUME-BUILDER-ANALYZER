import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import { User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Download, Save, Plus, X } from 'lucide-react';

const emptyExp = { title: '', company: '', location: '', startDate: '', endDate: '', description: '' };
const emptyEdu = { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' };
const emptyProj = { name: '', description: '', technologies: '', link: '' };
const emptyCert = { name: '', issuer: '', date: '' };

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function ResumeBuilder() {
  const [template, setTemplate] = useState('modern');
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState({ fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: '' });
  const [experience, setExperience] = useState([{ ...emptyExp }]);
  const [education, setEducation] = useState([{ ...emptyEdu }]);
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState([{ ...emptyProj }]);
  const [certifications, setCertifications] = useState([{ ...emptyCert }]);

  const updateInfo = (field, val) => setInfo({ ...info, [field]: val });
  const updateArr = (arr, setArr, idx, field, val) => {
    const copy = [...arr]; copy[idx] = { ...copy[idx], [field]: val }; setArr(copy);
  };
  const addItem = (arr, setArr, empty) => setArr([...arr, { ...empty }]);
  const removeItem = (arr, setArr, idx) => { if (arr.length > 1) setArr(arr.filter((_, i) => i !== idx)); };

  const handleSave = async () => {
    if (!info.fullName) return toast.error('Please enter your full name');
    setSaving(true);
    try {
      await api.post('/api/resume/create', {
        personalInfo: info, experience, education,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        projects, certifications, template,
      });
      toast.success('Resume saved!');
    } catch (err) { toast.error('Failed to save'); }
    setSaving(false);
  };

  const generatePDF = () => {
    if (!info.fullName) return toast.error('Please enter your full name');
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const pageW = doc.internal.pageSize.getWidth();
    const contentW = pageW - margin * 2;

    const checkPage = (needed) => {
      if (y + needed > 270) { doc.addPage(); y = margin; }
    };

    const colors = {
      modern: { primary: [108, 99, 255], secondary: [0, 210, 255] },
      classic: { primary: [33, 37, 41], secondary: [108, 117, 125] },
      creative: { primary: [230, 57, 70], secondary: [69, 123, 157] },
    };
    const c = colors[template] || colors.modern;

    // Header
    doc.setFillColor(...c.primary);
    doc.rect(0, 0, pageW, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(info.fullName || 'Your Name', margin, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactParts = [info.email, info.phone, info.location].filter(Boolean);
    doc.text(contactParts.join('  |  '), margin, 32);
    const linkParts = [info.linkedin, info.portfolio].filter(Boolean);
    if (linkParts.length) doc.text(linkParts.join('  |  '), margin, 39);
    y = 55;

    // Summary
    if (info.summary) {
      doc.setTextColor(...c.primary);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', margin, y); y += 2;
      doc.setDrawColor(...c.primary); doc.setLineWidth(0.5);
      doc.line(margin, y, margin + contentW, y); y += 5;
      doc.setTextColor(60, 60, 60); doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(info.summary, contentW);
      doc.text(lines, margin, y); y += lines.length * 4.5 + 6;
    }

    // Experience
    const validExp = experience.filter(e => e.title || e.company);
    if (validExp.length) {
      checkPage(20);
      doc.setTextColor(...c.primary); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', margin, y); y += 2;
      doc.setDrawColor(...c.primary); doc.line(margin, y, margin + contentW, y); y += 5;
      validExp.forEach(exp => {
        checkPage(18);
        doc.setTextColor(33, 37, 41); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text(exp.title, margin, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
        doc.setTextColor(108, 117, 125);
        const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
        if (dates) doc.text(dates, pageW - margin, y, { align: 'right' });
        y += 5;
        doc.setTextColor(60, 60, 60);
        doc.text(`${exp.company}${exp.location ? ' | ' + exp.location : ''}`, margin, y); y += 4;
        if (exp.description) {
          const dl = doc.splitTextToSize(exp.description, contentW);
          checkPage(dl.length * 4);
          doc.text(dl, margin, y); y += dl.length * 4 + 4;
        } else { y += 3; }
      });
      y += 2;
    }

    // Education
    const validEdu = education.filter(e => e.degree || e.institution);
    if (validEdu.length) {
      checkPage(18);
      doc.setTextColor(...c.primary); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', margin, y); y += 2;
      doc.setDrawColor(...c.primary); doc.line(margin, y, margin + contentW, y); y += 5;
      validEdu.forEach(edu => {
        checkPage(12);
        doc.setTextColor(33, 37, 41); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(108, 117, 125);
        const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
        if (dates) doc.text(dates, pageW - margin, y, { align: 'right' });
        y += 5;
        doc.setTextColor(60, 60, 60);
        doc.text(`${edu.institution}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`, margin, y);
        y += 7;
      });
      y += 2;
    }

    // Skills
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (skillList.length) {
      checkPage(14);
      doc.setTextColor(...c.primary); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', margin, y); y += 2;
      doc.setDrawColor(...c.primary); doc.line(margin, y, margin + contentW, y); y += 5;
      doc.setTextColor(60, 60, 60); doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
      const sl = doc.splitTextToSize(skillList.join('  •  '), contentW);
      doc.text(sl, margin, y); y += sl.length * 4.5 + 4;
    }

    // Projects
    const validProj = projects.filter(p => p.name);
    if (validProj.length) {
      checkPage(16);
      doc.setTextColor(...c.primary); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('PROJECTS', margin, y); y += 2;
      doc.setDrawColor(...c.primary); doc.line(margin, y, margin + contentW, y); y += 5;
      validProj.forEach(p => {
        checkPage(12);
        doc.setTextColor(33, 37, 41); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(p.name, margin, y); y += 4;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(60, 60, 60);
        if (p.description) {
          const pl = doc.splitTextToSize(p.description, contentW);
          checkPage(pl.length * 4);
          doc.text(pl, margin, y); y += pl.length * 4 + 2;
        }
        if (p.technologies) { doc.setTextColor(108, 117, 125); doc.text('Tech: ' + p.technologies, margin, y); y += 6; }
      });
    }

    doc.save(`${info.fullName || 'resume'}_resume.pdf`);
    toast.success('PDF downloaded!');
  };


  return (
    <div className="builder-page">
      <h1>✨ Resume Builder</h1>
      <p>Create a professional resume and export it as PDF</p>

      {/* Template Picker */}
      <div className="builder-section card">
        <h2><Award size={20} /> Choose Template</h2>
        <div className="template-picker">
          {['modern', 'classic', 'creative'].map(t => (
            <div key={t} className={`template-option ${template === t ? 'selected' : ''}`} onClick={() => setTemplate(t)}>
              <div style={{ fontSize: '2rem' }}>{t === 'modern' ? '💎' : t === 'classic' ? '📄' : '🎨'}</div>
              <h4>{t.charAt(0).toUpperCase() + t.slice(1)}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="builder-section card">
        <h2><User size={20} /> Personal Information</h2>
        <div className="builder-row">
          <InputField label="Full Name" value={info.fullName} onChange={(v) => updateInfo('fullName', v)} placeholder="John Doe" />
          <InputField label="Email" value={info.email} onChange={(v) => updateInfo('email', v)} placeholder="john@example.com" type="email" />
        </div>
        <div className="builder-row">
          <InputField label="Phone" value={info.phone} onChange={(v) => updateInfo('phone', v)} placeholder="+1 234 567 890" />
          <InputField label="Location" value={info.location} onChange={(v) => updateInfo('location', v)} placeholder="New York, NY" />
        </div>
        <div className="builder-row">
          <InputField label="LinkedIn" value={info.linkedin} onChange={(v) => updateInfo('linkedin', v)} placeholder="linkedin.com/in/yourname" />
          <InputField label="Portfolio" value={info.portfolio} onChange={(v) => updateInfo('portfolio', v)} placeholder="yourwebsite.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Professional Summary</label>
          <textarea className="form-input" placeholder="Brief summary of your professional background..." value={info.summary} onChange={(e) => updateInfo('summary', e.target.value)} />
        </div>
      </div>

      {/* Experience */}
      <div className="builder-section card">
        <h2><Briefcase size={20} /> Experience</h2>
        {experience.map((exp, i) => (
          <div key={i} className="entry-card">
            {experience.length > 1 && <button className="remove-entry" onClick={() => removeItem(experience, setExperience, i)}><X size={14} /></button>}
            <div className="builder-row">
              <InputField label="Job Title" value={exp.title} onChange={(v) => updateArr(experience, setExperience, i, 'title', v)} placeholder="Software Engineer" />
              <InputField label="Company" value={exp.company} onChange={(v) => updateArr(experience, setExperience, i, 'company', v)} placeholder="Google" />
            </div>
            <div className="builder-row">
              <InputField label="Start Date" value={exp.startDate} onChange={(v) => updateArr(experience, setExperience, i, 'startDate', v)} placeholder="Jan 2023" />
              <InputField label="End Date" value={exp.endDate} onChange={(v) => updateArr(experience, setExperience, i, 'endDate', v)} placeholder="Present" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Key achievements and responsibilities..." value={exp.description} onChange={(e) => updateArr(experience, setExperience, i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem(experience, setExperience, emptyExp)}>
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {/* Education */}
      <div className="builder-section card">
        <h2><GraduationCap size={20} /> Education</h2>
        {education.map((edu, i) => (
          <div key={i} className="entry-card">
            {education.length > 1 && <button className="remove-entry" onClick={() => removeItem(education, setEducation, i)}><X size={14} /></button>}
            <div className="builder-row">
              <InputField label="Degree" value={edu.degree} onChange={(v) => updateArr(education, setEducation, i, 'degree', v)} placeholder="B.Tech Computer Science" />
              <InputField label="Institution" value={edu.institution} onChange={(v) => updateArr(education, setEducation, i, 'institution', v)} placeholder="MIT" />
            </div>
            <div className="builder-row">
              <InputField label="Start Date" value={edu.startDate} onChange={(v) => updateArr(education, setEducation, i, 'startDate', v)} placeholder="2019" />
              <InputField label="End Date" value={edu.endDate} onChange={(v) => updateArr(education, setEducation, i, 'endDate', v)} placeholder="2023" />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem(education, setEducation, emptyEdu)}>
          <Plus size={16} /> Add Education
        </button>
      </div>

      {/* Skills */}
      <div className="builder-section card">
        <h2><Wrench size={20} /> Skills</h2>
        <div className="form-group">
          <label className="form-label">Skills (comma separated)</label>
          <textarea className="form-input" placeholder="React, Node.js, Python, MongoDB, AWS, Docker..." value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
      </div>

      {/* Projects */}
      <div className="builder-section card">
        <h2><FolderOpen size={20} /> Projects</h2>
        {projects.map((proj, i) => (
          <div key={i} className="entry-card">
            {projects.length > 1 && <button className="remove-entry" onClick={() => removeItem(projects, setProjects, i)}><X size={14} /></button>}
            <div className="builder-row">
              <InputField label="Project Name" value={proj.name} onChange={(v) => updateArr(projects, setProjects, i, 'name', v)} placeholder="E-commerce Platform" />
              <InputField label="Technologies" value={proj.technologies} onChange={(v) => updateArr(projects, setProjects, i, 'technologies', v)} placeholder="React, Node.js" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Brief description..." value={proj.description} onChange={(e) => updateArr(projects, setProjects, i, 'description', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem(projects, setProjects, emptyProj)}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Actions */}
      <div className="builder-actions">
        <button onClick={handleSave} className="btn btn-secondary btn-lg" disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Resume'}
        </button>
        <button onClick={generatePDF} className="btn btn-primary btn-lg">
          <Download size={18} /> Download PDF
        </button>
      </div>
    </div>
  );
}
