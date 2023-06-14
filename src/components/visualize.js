import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {BufferAttribute} from 'three';



function ThreeScene() {
  const [model, setModel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState(null);
  const [vtpFileUrl, setVtpFileUrl] = useState('');
  const [labels, setLabels] = useState([]);
  const displayModel = useRef(false);
  // const [selectMaterial, setSelectMaterial] = useState<Material | undefined>(undefined);

  //
  useEffect(() => {
    if (model && labels.length > 0) {
      applyColorToModel(model,labels);
    }
  }, [model, labels]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setModel(null);
    displayModel.current = false;

    const newFormData = new FormData();
    newFormData.append('file', file);
    setFormData(newFormData);

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
          // const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide});
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

  const handlePredictModel = async () => {
    setUploading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/model/upload-file-predict-labels/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = response.data.labels;
      setLabels(result);
      setMessage('Model predicted successfully');
      console.log('Labels:', result);
    } catch (error) {
      console.error('Error predicting model:', error);
    }

    try {
      const response = await axios.get('http://localhost:8000/vtp-file', {
        responseType: 'blob',
      });
      const vtpFileBlob = new Blob([response.data]);
      const vtpFileUrl = URL.createObjectURL(vtpFileBlob);
      console.log('VTP file URL:', vtpFileUrl);
      setVtpFileUrl(vtpFileUrl);
    } catch (error) {
      console.error('Error fetching VTP file:', error);
    }

    setUploading(false);
    applyColorToModel(model, labels); // Colorize the model after prediction
  };

  const renderModel = (object) => {
    const canvas = document.getElementById('canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(2000,800);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(light);
    scene.background = new THREE.Color(0xffffff);

    if (object) {
      scene.add(object);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

// const createColorMap = (labels) => {
//   const color = {};
//
//   labels.forEach((_, index) => {
//     const hue = Math.random(); // Generate a random hue value
//     const colors= new THREE.Color().setHSL(hue, 1, 0.5);
//     color[index] = colors;
//   });
//
//   return color;
// };



// const applyColorToModel = (object) => {
//   object.traverse((child) => {
//     if (child.isMesh) {
//       const geometry = child.geometry;
//       if (geometry && geometry.isBufferGeometry) {
//         const positionAttribute = geometry.getAttribute('position');
//         // const colors = [];
//         const color = {
//               0: [1, 0, 0],     // Red
//               1: [0, 1, 0],     // Green
//               2: [0, 0, 1],     // Blue
//               3: [1, 1, 0],     // Yellow
//               4: [1, 0, 1],     // Magenta
//               5: [0, 1, 1],     // Cyan
//               6: [1, 0.5, 0],   // Orange
//               7: [0.5, 0, 1],   // Purple
//               8: [0.5, 0.5, 0], // Brown
//               9: [0.8, 0.8, 0.8],   // Light Green
//               10: [0.5, 1, 1],  // Light Cyan
//                // add more key-value pairs for additional numbers/colors
//               11: [1, 255, 1],    // Magenta (for testing)
//               12: [1, 1, 255],  // Light Purple (for testing)
//               13: [0, 255, 1],  // Light Green (for testing)
//             14: [255, 0, 0],
//              };
//
//       // const geometry = mesh.geometry;
//       const vertexCount = geometry.getAttribute('position').count;
//       const colors = new Float32Array(vertexCount * 3);
//        for (let i = 0; i < labels; i++) {
//
//
//         numbers.push(labels[i]);
//         numbers.push(labels[i]);
//         numbers.push(labels[i]);
//       }
//       // assign a color to each vertex based on the corresponding number in the segmentation array
//       for (let i = 0; i < vertexCount; i++) {
//         const number = numbers[i];
//         const color1 = color[number] || [0, 0, 0];
//         colors[i * 3] = color1[0];
//         colors[i * 3 + 1] = color1[1];
//         colors[i * 3 + 2] = color1[2];
//       }
//
//       const colorAttribute = new BufferAttribute(colors, 3);
//       geometry.setAttribute('color', colorAttribute);
//       child.material.vertexColors = true; // Enable vertex colors
//       child.material.needsUpdate = true;
//       child.material.side = DoubleSide;
//       console.log('color_attribute:', colorAttribute);
//       // const material = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
//       // child.material = material;
//       }
//     }
//   });
// };

  const applyColorToModel = (object, labels) => {
  object.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry;
      if (geometry && geometry.isBufferGeometry) {
        const positionAttribute = geometry.getAttribute('position');
  //       // const colors=[];
  //
  //       const vertexCount = positionAttribute.count;
        const color = [
          [255, 165, 0, 1],   // Orange
          [0, 128, 0, 1],     // Dark Green
          [128, 0, 128, 1],   // Purple
          [255, 99, 71, 1],   // Tomato
          [30, 144, 255, 1],  // Dodger Blue
          [255, 0, 255, 1],   // Fuchsia
          [70, 130, 180, 1],  // Steel Blue
          [255, 192, 203, 1], // Pink
          [255, 215, 0, 1],   // Gold
          [169, 169, 169, 1], // Dark Gray
          [255, 20, 147, 1],  // Deep Pink
          [0, 255, 255, 1],   // Aqua
          [255, 69, 0, 1],    // Orange Red
          [128, 0, 0, 1],     // Maroon
          [0, 250, 154, 1],   // Medium Spring Green
        ];
        // const color = {
        //   0: [1, 0, 0],     // Red
        //   1: [0, 1, 0],     // Green
        //   2: [0, 0, 1],     // Blue
        //   3: [1, 1, 0],     // Yellow
        //   4: [1, 0, 1],     // Magenta
        //   5: [0, 1, 1],     // Cyan
        //   6: [1, 0.5, 0],   // Orange
        //   7: [0.5, 0, 1],   // Purple
        //   8: [0.5, 0.5, 0], // Brown
        //   9: [0.8, 0.8, 0.8],   // Light Grey
        //   10: [0.5, 1, 1],  // Light Cyan
        //   11: [1, 0.5, 1],  // Light Magenta
        //   12: [1, 1, 1],    // White
        //   13: [0, 0, 0],    // Black
        //   14: [0.9, 0.5, 0.2], // Light Orange
        // };

        const vertexCount = geometry.getAttribute('position').count;
        const colors = new Float32Array(vertexCount * 4);
        for (let i = 0; i < vertexCount; i++) {
          const label = labels[i];
          const color_ = color[label] || [0, 0, 0, 1];
          colors[i * 4] = color_[0] / 255;
          colors[i * 4 + 1] = color_[1] / 255;
          colors[i * 4 + 2] = color_[2] / 255;
          colors[i * 4 + 3] = color_[3];
        }
        const colorAttribute = new BufferAttribute(colors, 4);
        geometry.setAttribute('color', colorAttribute);
        const material = child.material;
        material.vertexColors = true; // Enable vertex colors
        material.needsUpdate = true;
        // const vertexCount = positionAttribute.count;
      //    // const colors = new Float32Array(vertexCount * 3);
      //   const numbers = new Array(vertexCount);
      // for (let i = 0; i < labels.length; i++) {
      //
      //
      //   numbers.push(labels[i]);
      //   numbers.push(labels[i]);
      //   numbers.push(labels[i]);
      // }
      //   for (let i = 0; i < vertexCount; i++) {
      //     numbers[i] = labels[i];
      //     const number = labels[i];
      //     const color1 = color[number] || [0, 0, 0];
      //     colors[i * 3] = color1[0];
      //     colors[i * 3 + 1] = color1[1];
      //     colors[i * 3 + 2] = color1[2];
      //   }
      //
      //
      //   for (let i = 0; i < positionAttribute.count; i++) {
      //     const label = numbers[i];
      //     const color = new THREE.Color().setHex(Math.random() * 0xffffff);
      //
      //     colors.push(color.r, color.g, color.b);
      //   }
      //   const material = new THREE.MeshBasicMaterial({
      //     color: 0xffffff,
      //     side: THREE.DoubleSide, // Set the side property to DoubleSide
      //     vertexColors: true
      //   });
      //   const colorAttribute = new THREE.BufferAttribute(new Float32Array(colors), 3);
      //   geometry.setAttribute('color', colorAttribute);
      //   child.material.vertexColors = true; // Enable vertex colors
      //   child.material.needsUpdate = true;
      //           // const colorAttribute = new BufferAttribute(colors, 3);
      //   // geometry.setAttribute('color', colorAttribute);
      //   // child.material.vertexColors = true; // Enable vertex colors
      //   // child.material.needsUpdate = true;
        material.side = THREE.DoubleSide;
      }
    }
  });
};



// const mapLabelsToColors = () => {
//   useEffect(() => {
//     const geometry = new THREE.BoxGeometry();
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//
//     const mesh_1 = new THREE.Mesh(geometry, material);
//     setMesh(mesh_1);}, []);
//         if (selectMaterial&& selectMaterial && mesh_1.geometry)
//         {
//        selectMaterial.vertexColors = true; // enable vertex coloring
//        selectMaterial.side = DoubleSide;
//
//        selectMaterial.visible=true;
//
//
//        const geometry = mesh_1.geometry;
//       // const geometry: BufferGeometry = mesh.geometry as BufferGeometry;
//     // const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
//
//      const colorMap = {
//       0: [1, 0, 0],     // Red
//       1: [0, 1, 0],     // Green
//       2: [0, 0, 1],
//       3: [1, 1, 0],     // Yellow
//       4: [1, 0, 1],     // Magenta
//       5: [0, 1, 1],     // Cyan
//       6: [1, 0.5, 0],   // Orange
//       7: [0.5, 0, 1],   // Purple
//       8: [0.5, 0.5, 0], // Brown
//       9: [0.8, 0.8, 0.8],   // Light Green
//       10: [0.5, 1, 1],  // Light Cyan
//        // add more key-value pairs for additional numbers/colors
//      };
//       const vertexCount = mesh_1.geometry.getAttribute('position').count;
//        const colors = new Float32Array(vertexCount*3 );
//
//        // assign a color to each vertex based on the corresponding number in the .seg file
//
//
//        for (let i = 0; i < labels; i++) {
//
//
//         numbers.push(labels[i]);
//         numbers.push(labels[i]);
//         numbers.push(labels[i]);
//       }
//
//
//           for (let i = 0; i < vertexCount; i++) {
//            const number =  numbers[i];
//
//          // add more if statements for additional numbers
//            //const color = colorMap[number] || [0, 0, 0]; // default to white if no color is defined for this number
//
//            const color1= colorMap[number]|| [0, 0, 0];
//            colors[i * 3] = color1[0];
//            colors[i * 3 + 1] = color1[1];
//            colors[i * 3 + 2] = color1[2];
//
//
//            const colorAttribute = new BufferAttribute(colors, 3);
//
//            geometry.setAttribute('color', colorAttribute);
//            colorAttribute.needsUpdate = true; // flag the attribute as needing update
//    }
// }
// };


  const handleDisplayModel = () => {
    displayModel.current = true;
    renderModel(model);
  };

  const handleColorizeModel = () => {
if (model && labels.length > 0) {
    // mapLabelsToColors(model, labels); // Call applyColorToModel to colorize the model based on labels
    applyColorToModel(model, labels);
  }
  };

  const handleDownload = () => {
    if (vtpFileUrl) {
      const link = document.createElement('a');
      link.href = vtpFileUrl;
      link.download = 'out_downsampling_refined_colored.vtp';
      link.click();
    }
  };

  return (
    <div>
      <form >

        <input  className="hi" type="file" accept=".obj,.stl,.glb,.gltf" onChange={handleFileUpload} />
        {!displayModel.current && (
          <button type="button" className="display-button" onClick={handleDisplayModel} disabled={!model}>
            Display Model
          </button>

        )}
        <div className="space">
        </div>
        <button type="button" className="display-button" onClick={handlePredictModel} disabled={!model || uploading}>
          {uploading ? 'Predicting...' : 'Predict'}
        </button>
        <div className="space">
        </div>
        <button type="button" className="display-button" onClick={handleColorizeModel} disabled={!model || labels.length === 0}>
          Colorize
        </button>
        <div className="space">
        </div>
        <button type="button" className="display-button" onClick={handleDownload} disabled={!vtpFileUrl}>
          Download predicted file
        </button>
      </form>
      {message && <div>{message}</div>}
      <canvas id="canvas" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  );
}

export default ThreeScene;