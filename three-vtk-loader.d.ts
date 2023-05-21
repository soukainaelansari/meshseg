declare module 'three-vtk-loader' {
    import { Object3D } from 'three';
  
    interface VTKLoader {
      parse(data: ArrayBuffer | string): Object3D;
    }
  
    const VTKLoader: {
      new (): VTKLoader;
    };
  
    export { VTKLoader };
  }
  