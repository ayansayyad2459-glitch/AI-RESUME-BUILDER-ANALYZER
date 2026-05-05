const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Generate job search links based on query
router.get('/search', protect, (req, res) => {
  try {
    const { q, location } = req.query;
    if (!q) return res.status(400).json({ message: 'Please provide a search query' });
    const query = encodeURIComponent(q);
    const loc = location ? encodeURIComponent(location) : '';
    const results = [
      { platform: 'LinkedIn', url: `https://www.linkedin.com/jobs/search/?keywords=${query}${loc ? '&location=' + loc : ''}`, icon: 'linkedin' },
      { platform: 'Indeed', url: `https://www.indeed.com/jobs?q=${query}${loc ? '&l=' + loc : ''}`, icon: 'indeed' },
      { platform: 'Glassdoor', url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}${loc ? '&locT=C&locKeyword=' + loc : ''}`, icon: 'glassdoor' },
      { platform: 'Naukri', url: `https://www.naukri.com/${query.replace(/%20/g, '-')}-jobs${loc ? '-in-' + loc.replace(/%20/g, '-') : ''}`, icon: 'naukri' },
      { platform: 'Google Jobs', url: `https://www.google.com/search?q=${query}+jobs${loc ? '+in+' + loc : ''}`, icon: 'google' },
      { platform: 'Monster', url: `https://www.monster.com/jobs/search/?q=${query}${loc ? '&where=' + loc : ''}`, icon: 'monster' },
      { platform: 'ZipRecruiter', url: `https://www.ziprecruiter.com/jobs-search?search=${query}${loc ? '&location=' + loc : ''}`, icon: 'ziprecruiter' },
      { platform: 'AngelList', url: `https://angel.co/jobs?q=${query}`, icon: 'angellist' },
    ];
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error generating job links' });
  }
});

module.exports = router;
