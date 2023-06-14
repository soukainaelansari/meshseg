import React, { useState, useEffect } from 'react';
const [modelUrl, setModelUrl] = useState('');
useEffect(() => {
  const fetchModelUrl = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/download', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      setModelUrl(url);
    } catch (error) {
      console.error('Error fetching model URL:', error);
    }
  };

  fetchModelUrl();

  return () => {
    // Clean up the URL when the component unmounts
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
  };
}, []);
const renderScene = (canvas) => {
  // ...

  if (displayModel && model) {
    scene.add(model);
  }

  if (modelUrl) {
    const loader = new THREE.VTKLoader();
    loader.load(
      modelUrl,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  // ...
};
const handlePredictModel = async () => {
  setUploading(true);

  try {
    const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const predictions = response.data.predictions;
    console.log('Predictions:', predictions);

    // Handle the prediction response

    setMessage('Model predicted successfully');
  } catch (error) {
    console.error('Error predicting model:', error);
  }

  setUploading(false);
};
