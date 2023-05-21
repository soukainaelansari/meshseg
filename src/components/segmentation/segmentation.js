
// import React, { useState, useEffect } from "react";

// function MyComponent() {
// -
//   useEffect(() => {
//     fetch("/upload-file-segment-refined/")
//       .then((response) => response.json())
//       .then((data) => setData(data));
//   }, []);

//   return (
//     <div>
//       <h1>My Data:</h1>
//       <ul>
//         {data.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default MyComponent;
import React, { useState } from 'react';

function MyComponent() {
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify("http://127.0.0.1:8000/model/upload-file-segment-downsampling/")
    });

    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div>
      <button onClick={handlePredict}>Predict</button>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
}
export default MyComponent;

  