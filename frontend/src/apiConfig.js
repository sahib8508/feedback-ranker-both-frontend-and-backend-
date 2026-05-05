// API Configuration for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Remove trailing slashes to avoid double slashes in URLs
export default API_BASE_URL;