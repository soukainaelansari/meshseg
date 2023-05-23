// import  ThreeScene from "./components/upload/segmentation.js";
 //import  UploadComponent from "./components/segmentation/segmentation.js";
 // const App = () => {
//   return (
//      <div className="container">
    
//              < ThreeScene/>,
//              <  MyComponent/>,
        
//     </div>
    
//     )
//  };

// export default App;
 import "./App.css";
 //import { Footer, Blog, Possibility, Features, WhatGPT3, Header } from './containers';
 //import { Upload,UploadComponent, Navbar } from './components';
 import  Navbar from "./components/navbar/navbar.js";
 import  Header from "./containers/header/Header.js";
import Upload from "./components/upload/upload.js";
function App() {
  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar />,
        <Header />
      </div>
      <Upload />
    </div>
  );
}
 
 export default App;
