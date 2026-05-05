import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Papa from 'papaparse';
import './CSVUploader.css'; // You'll need to create this CSS file

const CSVUploader = ({ collegeCode }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setPreviewData(null);
      return;
    }

    // Check if it's a CSV file
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      setFile(null);
      setPreviewData(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);

    // Preview the CSV data
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Only show the first 5 rows in preview
          setPreviewData({
            headers: results.meta.fields,
            rows: results.data.slice(0, 5)
          });
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setPreviewData(null);
        }
      });
    };
    reader.readAsText(selectedFile);
  };

  // Upload CSV and update college document
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    if (!collegeCode) {
      setError('College Code is required');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Upload file to Firebase Storage
      const storage = getStorage();
      const storageFilePath = `csvs/${collegeCode}_students.csv`;
      const storageRef = ref(storage, storageFilePath);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // 2. Update the college document with the path to the CSV
      const collegeRef = doc(db, "colleges", collegeCode);
      await updateDoc(collegeRef, {
        studentDataPath: storageFilePath,
        studentDataUrl: downloadURL,
        lastUpdated: new Date().toISOString()
      });
      
      setSuccess(true);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError(`Failed to upload CSV: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="csv-uploader">
      <h3>Upload Student Data</h3>
      <p className="csv-uploader-instructions">
        Upload a CSV file containing student information. The file must include a column with student mobile numbers.
      </p>
      
      <div className="csv-upload-controls">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="csv-file-input"
          disabled={uploading}
        />
        
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? (
            <>
              <span className="button-spinner"></span>
              Uploading...
            </>
          ) : (
            "Upload CSV"
          )}
        </button>
      </div>
      
      {error && <div className="upload-error">{error}</div>}
      {success && (
        <div className="upload-success">
          <div className="success-icon">✓</div>
          Student data successfully uploaded and linked to your college profile.
        </div>
      )}
      
      {previewData && (
        <div className="csv-preview">
          <h4>CSV Preview:</h4>
          <div className="csv-preview-table-container">
            <table className="csv-preview-table">
              <thead>
                <tr>
                  {previewData.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {previewData.headers.map((header, colIndex) => (
                      <td key={colIndex}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="preview-note">
            * Only showing first 5 rows. The full data will be uploaded.
          </p>
        </div>
      )}
      
      <div className="csv-format-guide">
        <h4>CSV Format Guidelines:</h4>
        <ul>
          <li>File must be in CSV format</li>
          <li>First row should contain column headers</li>
          <li>Required columns: 
            <span className="required-column">Mobile/Phone Number</span>
            <span className="required-column">Name</span>
            <span className="required-column">Roll Number</span>
          </li>
          <li>Mobile numbers should be in a standard format (preferably 10 digits)</li>
        </ul>
      </div>
    </div>
  );
};

export default CSVUploader;