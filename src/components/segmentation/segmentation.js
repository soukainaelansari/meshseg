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
    const response = await axios.post('http://127.0.0.1:8000/model/upload-file-segment-refined/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    const file = new Blob([response.data], { type: 'application/octet-stream' });
    const fileUrl = URL.createObjectURL(file);

    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = 'refined_colored_file.vtp';  // Set the filename here
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(fileUrl);

    setMessage('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
    setMessage('Error downloading file');
  } finally {
    setUploading(false);
  }
// try {
//   const response = await axios.post('http://127.0.0.1:8000/model/upload-file-segment-refined/', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     responseType: 'blob',
//     withCredentials: true,
//   });
//   const url = window.URL.createObjectURL(new Blob([response.data]));
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', 'refined_colored_file.vtp');
//   document.body.appendChild(link);
//   link.click();
//   setMessage('File downloaded successfully');
// } catch (error) {
//   console.error('Error downloading file:', error);
//   setMessage('Error downloading file');
// } finally {
//   setUploading(false);
// }
  // try {
  //   const response = await axios.post('http://127.0.0.1:8000/model/upload-file-segment-refined/', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  //   console.log('Model predicted:', response.data.fileName);
  //   setMessage(`Model predicted`);
  //   const predictions = response.data.predictions;
  //   console.log('Predictions:', predictions);
  // } catch (error) {
  //   console.error('Error Predicting file:', error);
  //   setMessage('Error Predicting file');}
  //     finally{
  //     setUploading(false);
  //  }

};

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //
  //   const formData = new FormData();
  //   formData.append('file', file);
  //
  //   setUploading(true);
  //   setMessage('');
  //
  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log('Model uploaded:', response.data.fileName);
  //     setMessage(`Model uploaded`);
  //   } catch (error) {
  //     console.error('Error Predicting file:', error);
  //     setMessage('Error Predicting file');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

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
