import React, { useState, useEffect } from 'react';
import API_BASE_URL from './apiConfig';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiBook, 
  FiFileText, 
  FiLayers,
  FiUpload,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import "./CollegeResources.css";
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiSun,
  FiMoon,
} from 'react-icons/fi';

const CollegeResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
const [userProfileOpen] = useState(false);  
const [mobileNavOpen, setMobileNavOpen] = useState(false);
const [headerScrolled, setHeaderScrolled] = useState(false);
  // Filter states
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload form states
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    college: '',
    department: '',
    year: '',
    semester: '',
    resourceType: '',
    subject: '',
    file: null
  });

  const resourceTypes = [
    'Previous Year Questions (PYQ)',
    'Notes',
    'Lab Manuals',
    'Sample Papers',
    'Syllabus',
    'Projects',
    'Assignments',
    'Reference Books',
    'Practical Files'
  ];
const portalNavItems = [
  { name: 'Home', path: '/', icon: <FiHome /> },
  { name: 'Students Dashboard', path: '/student', icon: <FiUsers /> },
  
];

const portalUserMenu = [

];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchColleges();
    fetchDepartments();
    fetchResources();
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    filterResources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, selectedCollege, selectedDepartment, selectedYear, selectedResourceType, searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};

useEffect(() => {
  const handleScroll = () => {
    setHeaderScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  const fetchColleges = async () => {
    try {
      console.log('Fetching colleges...');
      const response = await fetch(`${API_BASE_URL}/api/colleges`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Colleges data received:', data);
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        console.log('Setting colleges:', data.data);
        setColleges(data.data);
      } else if (Array.isArray(data)) {
        console.log('Setting colleges (direct array):', data);
        setColleges(data);
      } else {
        console.warn('Unexpected data format:', data);
        setColleges([]);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setError('Failed to load colleges. Please try again.');
      setColleges([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments...');
      const response = await fetch(`${API_BASE_URL}/api/departments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Departments data received:', data);
      
      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        console.warn('Departments data is not an array:', data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments. Please try again.');
      setDepartments([]);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching resources...');
      const response = await fetch(`${API_BASE_URL}/api/resources`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Resources data received:', data);
      
      if (Array.isArray(data)) {
        setResources(data);
        setFilteredResources(data);
      } else {
        console.warn('Resources data is not an array:', data);
        setResources([]);
        setFilteredResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please check your connection and try again.');
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCollege) {
      filtered = filtered.filter(resource => resource.college === selectedCollege);
    }
    if (selectedDepartment) {
      filtered = filtered.filter(resource => resource.department === selectedDepartment);
    }
    if (selectedYear) {
      filtered = filtered.filter(resource => resource.year === selectedYear);
    }
    if (selectedResourceType) {
      filtered = filtered.filter(resource => resource.resourceType === selectedResourceType);
    }
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      alert('Please select a file to upload');
      return;
    }

    const requiredFields = ['title', 'college', 'department', 'year', 'semester', 'resourceType', 'subject'];
    const missingFields = requiredFields.filter(field => !uploadForm[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (uploadForm.file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    Object.keys(uploadForm).forEach(key => {
      if (uploadForm[key] !== null && uploadForm[key] !== '') {
        formData.append(key, uploadForm[key]);
      }
    });

    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/api/resources/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Resource uploaded successfully!');
        setUploadModalOpen(false);
        setUploadForm({
          title: '',
          description: '',
          college: '',
          department: '',
          year: '',
          semester: '',
          resourceType: '',
          subject: '',
          file: null
        });
        fetchResources();
      } else {
        alert(result.error || 'Error uploading resource');
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Error uploading resource. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resourceId, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/download/${resourceId}`);
      if (response.ok) {
        window.open(`${API_BASE_URL}/api/resources/download/${resourceId}`, '_blank');
      } else {
        alert('Error downloading file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const resetFilters = () => {
    setSelectedCollege('');
    setSelectedDepartment('');
    setSelectedYear('');
    setSelectedResourceType('');
    setSearchTerm('');
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Previous Year Questions (PYQ)': return <FiFileText className="resource-icon-blue" />;
      case 'Notes': return <FiBook className="resource-icon-green" />;
      case 'Lab Manuals': return <FiLayers className="resource-icon-purple" />;
      case 'Sample Papers': return <FiFileText className="resource-icon-orange" />;
      case 'Syllabus': return <FiBook className="resource-icon-red" />;
      default: return <FiFileText className="resource-icon-gray" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      if (dateString && dateString.seconds) {
        return new Date(dateString.seconds * 1000).toLocaleDateString();
      }
      if (dateString && dateString._seconds) {
        return new Date(dateString._seconds * 1000).toLocaleDateString();
      }
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="college-resources-loading-container">
        <div className="college-resources-loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="college-resources-error-container">
        <div className="college-resources-error-content">
          <FiAlertCircle className="college-resources-error-icon" />
          <h3 className="college-resources-error-title">Error Loading Resources</h3>
          <p className="college-resources-error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="college-resources-retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
 <div className={`college-resources-main-container ${darkMode ? 'dark-mode' : ''}`}>
    {/* Add this header section */}
    <header className={`portal-header ${headerScrolled ? "portal-header-scrolled" : ""}`}>
      <div className="portal-header-content">
        <div className="portal-brand">
          <Link to="/">
            <h1 className="portal-logo">Feedback Ranker</h1>
          </Link>
          <span className="portal-subtitle">Student Portal</span>
        </div>

        <div className="portal-nav-wrapper">
          {/* Desktop Navigation */}
          <nav className="portal-desktop-nav">
            <ul className="portal-nav-list">
              {portalNavItems.map((item, index) => (
                <li key={index} className="portal-nav-item">
                  <Link to={item.path} className="portal-nav-link">
                    {item.icon}
                    <span className="portal-nav-text">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Controls */}
          <div className="portal-user-controls">
            <button
              onClick={toggleDarkMode}
              className="portal-theme-toggle"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="portal-theme-icon" />
              ) : (
                <FiMoon className="portal-theme-icon" />
              )}
            </button>

            <div className="portal-user-menu">
              

              {userProfileOpen && (
                <div className="portal-user-dropdown">
                  {portalUserMenu.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="portal-dropdown-item"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="portal-mobile-button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className={`portal-hamburger ${mobileNavOpen ? "portal-hamburger-open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </header>
      
      <div className="college-resources-content-wrapper">
        <div className="college-resources-header">
          <div className="college-resources-title-section">
            <h1 className="college-resources-main-title">College Resources</h1>
            
            <p className="college-resources-subtitle">
              Access and share academic resources across colleges
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="college-resources-upload-button"
          >
            <FiUpload />
            Upload Resource
          </button>
        </div>

        {/* Debug Info - Remove this in production */}
       

        {/* Filters Section */}
        <div className="college-resources-filters-container">
          <div className="college-resources-filters-header">
            <h2 className="college-resources-filters-title">
              <FiFilter />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="college-resources-clear-filters"
            >
              Clear All
            </button>
          </div>

          <div className="college-resources-filters-grid">
            <select
              value={selectedCollege}
              onChange={(e) => {
                console.log('College selected:', e.target.value);
                setSelectedCollege(e.target.value);
              }}
              className="college-resources-college-select"
            >
              <option value="">Select Colleges</option>
              {colleges.map(college => (
                <option key={college.id || college.name} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="college-resources-department-select"
            >
              <option value="">Select Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="college-resources-year-select"
            >
              <option value="">Select Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
              className="college-resources-type-select"
            >
              <option value="">Select Resource Types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="college-resources-search-container">
            <FiSearch className="college-resources-search-icon" />
            <input
              type="text"
              placeholder="Search resources, subjects, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="college-resources-search-input"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="college-resources-grid">
          {filteredResources.length === 0 ? (
            <div className="college-resources-empty-state">
              <p className="college-resources-empty-message">No resources found matching your criteria</p>
            </div>
          ) : (
            filteredResources.map(resource => (
              <div key={resource.id} className="college-resources-card">
                <div className="college-resources-card-content">
                  <div className="college-resources-card-header">
                    <div className="college-resources-type-badge">
                      {getResourceIcon(resource.resourceType)}
                      <span className="college-resources-type-text">
                        {resource.resourceType}
                      </span>
                    </div>
                    <span className="college-resources-year-badge">
                      {resource.year}
                    </span>
                  </div>

                  <h3 className="college-resources-card-title">
                    {resource.title}
                  </h3>

                  <p className="college-resources-card-description">
                    {resource.description}
                  </p>

                  <div className="college-resources-details-grid">
                    <div className="college-resources-detail-row">
                      <span className="college-resources-detail-label">College:</span>
                      <span className="college-resources-detail-value">{resource.college}</span>
                    </div>
                    <div className="college-resources-detail-row">
                      <span className="college-resources-detail-label">Department:</span>
                      <span className="college-resources-detail-value">{resource.department}</span>
                    </div>
                    <div className="college-resources-detail-row">
                      <span className="college-resources-detail-label">Subject:</span>
                      <span className="college-resources-detail-value">{resource.subject}</span>
                    </div>
                    <div className="college-resources-detail-row">
                      <span className="college-resources-detail-label">Semester:</span>
                      <span className="college-resources-detail-value">{resource.semester}</span>
                    </div>
                  </div>

                  <div className="college-resources-card-footer">
                    <div className="college-resources-upload-date">
                      <FiCalendar />
                      {formatDate(resource.uploadDate)}
                    </div>
                    <button
                      onClick={() => handleDownload(resource.id, resource.fileName)}
                      className="college-resources-download-button"
                    >
                      <FiDownload />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {uploadModalOpen && (
          <div className="college-resources-modal-overlay">
            <div className="college-resources-modal-container">
              <div className="college-resources-modal-header">
                <h2 className="college-resources-modal-title">Upload Resource</h2>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="college-resources-modal-close"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="college-resources-modal-content">
                <div className="college-resources-form-grid">
                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      className="college-resources-form-input"
                    />
                  </div>

                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                      className="college-resources-form-input"
                    />
                  </div>

                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      College *
                    </label>
                    <select
                      required
                      value={uploadForm.college}
                      onChange={(e) => setUploadForm({...uploadForm, college: e.target.value})}
                      className="college-resources-form-input"
                    >
                      <option value="">Select College</option>
                      {colleges.map(college => (
                        <option key={college.id || college.name} value={college.name}>{college.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      Department *
                    </label>
                    <select
                      required
                      value={uploadForm.department}
                      onChange={(e) => setUploadForm({...uploadForm, department: e.target.value})}
                      className="college-resources-form-input"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      Year *
                    </label>
                    <select
                      required
                      value={uploadForm.year}
                      onChange={(e) => setUploadForm({...uploadForm, year: e.target.value})}
                      className="college-resources-form-input"
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="college-resources-form-group">
                    <label className="college-resources-form-label">
                      Semester *
                    </label>
                    <select
                      required
                      value={uploadForm.semester}
                      onChange={(e) => setUploadForm({...uploadForm, semester: e.target.value})}
                      className="college-resources-form-input"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  <div className="college-resources-form-group-wide">
                    <label className="college-resources-form-label">
                      Resource Type *
                    </label>
                    <select
                      required
                      value={uploadForm.resourceType}
                      onChange={(e) => setUploadForm({...uploadForm, resourceType: e.target.value})}
                      className="college-resources-form-input"
                    >
                      <option value="">Select Resource Type</option>
                      {resourceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="college-resources-form-group">
                  <label className="college-resources-form-label">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="college-resources-form-textarea"
                    placeholder="Brief description of the resource..."
                  />
                </div>

                <div className="college-resources-form-group">
                  <label className="college-resources-form-label">
                    File *
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                    className="college-resources-file-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  />
                  <p className="college-resources-file-hint">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG (Max 10MB)
                  </p>
                </div>

                <div className="college-resources-modal-actions">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="college-resources-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="college-resources-confirm-button"
                  >
                    {uploading ? 'Uploading...' : 'Upload Resource'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeResources;