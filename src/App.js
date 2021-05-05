import React, { useState, useEffect} from 'react';
import './App.css';

function App() {

  const [initialData, setInitialData] = useState(0)

  useEffect(() => {
    let timeIt = setTimeout(() => {
      fetch('/api/infy').then(
        response => response.json()
      ).then(data => setInitialData(data));
    }, 3000);

    return () => clearTimeout(timeIt)
    
  });

  console.log(initialData)
  return (
    <div className="App">
      <h1>{initialData.symbol}</h1>
    </div>
  );
}

export default App;
