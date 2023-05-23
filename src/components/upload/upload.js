import React, { useState,useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
//import { PLYLoader } from '../../loaders/PLYLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

//import { VTKLoader } from '../../loaders/VTKLoader.js';
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './upload.css';
import axios from 'axios';

function Upload() {
    const [model, setModel] = useState(null);
    const inputRef = useRef();
     const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
   const renderScene = (canvas) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(900, 600);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(light);
    scene.background = new THREE.Color(0xffffff);


    if (model) {
      scene.add(model);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];

    if (file.name.endsWith('.obj')) {
      const loader = new OBJLoader();
      loader.load(
        URL.createObjectURL(file),
        (obj) => {
          setModel(obj);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
    } else if (file.name.endsWith('.stl')) {
      const loader = new STLLoader();
      loader.load(
        URL.createObjectURL(file),
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const mesh = new THREE.Mesh(geometry, material);
          setModel(mesh);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
    }else if (file.name.endsWith('.ply')) {
      const loader= new PLYLoader();
      loader.load(
        URL.createObjectURL(file),
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const mesh = new THREE.Mesh(geometry, material);
          setModel(mesh);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
    } else if (file.name.endsWith('.vtp')) {
      const loader = new VTKLoader();
      loader.load(
        URL.createObjectURL(file),
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const mesh = new THREE.Mesh(geometry, material);
          setModel(mesh);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
       } else if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        const loader = new GLTFLoader();
        loader.load(
          URL.createObjectURL(file),
          (gltf) => {
            setModel(gltf.scene || gltf.scenes[0]);
          },
          undefined,
          (error) => {
            console.error(error);
          }
        );
    } else {
      console.error('Invalid file type');
    }
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
  }};

  const handleButtonClick = () => {
    inputRef.current.click();
  };
  return (
    <>
    <div className="file-card" id="upload">
      <div className="file-inputs">
      <h1> Upload 3D Object</h1>
        <input type="file" multiple accept=".obj ,.stl,.glb,.gltf,.fbx, .ply,.vtp"  onChange={handleFileUpload} ref={inputRef}  style={{ display: 'none' }}/>
        <button type="button" className="upload-button" onClick={handleButtonClick}>
                          <i>
                            <FontAwesomeIcon icon={faPlus} />
                        </i>Upload</button>

                        </div>
      <p className="main">Supported files</p>
                <p className="info">OBJ, STL, PLY, VTP, GLB, GLTG, FBX</p>
      <canvas
        id="canvas"
        ref={(canvas) => {
          if (canvas) {
            renderScene(canvas);
          }
        }}
        style={{ width: '100%', height: '100%' }}

      > </canvas>

    </div>
       <div>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileUpload} />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
        {message && <div>{message}</div>}
      </div>
    </>
  )
}

export default Upload;