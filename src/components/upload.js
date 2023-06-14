import React, { useState } from 'react';
import axios from 'axios';

function UploadComponent() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };
const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('file', file);
  setUploading(true);
  setMessage('');
  try {
    const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Model predicted:', response.data.fileName);
    setMessage(`Model predicted`);
    // Access the predictions data from the response
    const predictions = response.data.predictions;
    console.log('Predictions:', predictions);
  } catch (error) {
    console.error('Error Predicting file:', error);
    setMessage('Error Predicting file');}
      finally{
      setUploading(false);
   }

};



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileUpload} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Predicting...' : 'Predict'}
        </button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default UploadComponent;
