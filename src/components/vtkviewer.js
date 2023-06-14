
import React, { useState, useRef, useEffect } from 'react';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import axios from 'axios';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkLookupTable from '@kitware/vtk.js/Common/Core/LookupTable';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';

import 'bootstrap/dist/css/bootstrap.min.css';

function VTKViewer() {
  const [file, setFile] = useState(null);
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const [colorByField, setColorByField] = useState('');

  const handleColorByFieldChange = (event) => {
    setColorByField(event.target.value);
  };

  const handleVisualize = async () => {
    if (!file) {
      console.error('No VTP file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = 'http://localhost:8000';
      const uploadResponse = await axios.post(`${baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const vtpFileUrl = `${baseUrl}/vtp-file`;
      visualizeVTPFile(vtpFileUrl);
    } catch (error) {
      console.error('Error visualizing VTP file:', error);
    }
  };

  const applyColorBy = () => {

    const { polyData, mapper } = context.current;
const labelArray = vtkDataArray.newInstance({
  name: 'Label',
  values: polyData.getPointData().getArrayByName('Label').getData(),
});
polyData.getPointData().setScalars(labelArray);


    const lookupTable = vtkLookupTable.newInstance();
    lookupTable.setHueRange(0.667, 0.0); // Set the hue range for the color map

    const colorTransferFunction = vtkColorTransferFunction.newInstance();
    colorTransferFunction.setMappingRange(polyData.getPointData().getScalars().getRange());
    colorTransferFunction.updateRange();

    lookupTable.applyColorMap(colorTransferFunction);

    mapper.setLookupTable(lookupTable);
    mapper.setScalarModeToUsePointData();
    mapper.selectColorArray(colorByField, 'default');
    mapper.setColorBy(colorByField);

    context.current.fullScreenRenderer.render();
  };

  const visualizeVTPFile = (vtpFileUrl) => {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: vtkContainerRef.current,
    });
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    const vtpReader = vtkXMLPolyDataReader.newInstance();
    vtpReader.setUrl(vtpFileUrl).then(() => {
      const polyData = vtpReader.getOutputData(0);

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polyData);

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      renderer.addActor(actor);

      if (colorByField !== '') {
        applyColorBy();
      }

      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer,
        vtpReader,
        polyData,
        mapper,
        actor,
      };
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    return () => {
      if (context.current) {
        const { fullScreenRenderer, vtpReader, polyData, mapper, actor } = context.current;
        if (vtpReader) vtpReader.delete();
        if (polyData) polyData.delete();
        if (mapper) mapper.delete();
        if (actor) actor.delete();
        if (fullScreenRenderer) fullScreenRenderer.delete();
      }
    };
  }, []);


  return (
    <div >
      <div  ref={vtkContainerRef} />
      <table
        style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <input type="file" accept=".vtp" onChange={handleFileChange}  />

            </td>
          </tr>
          <tr>
            <td>

            </td>
          </tr>
          <tr>
            <td>
              <button type="button" onClick={handleVisualize}>
                Predict
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VTKViewer;
