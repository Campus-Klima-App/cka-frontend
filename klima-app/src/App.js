import React from 'react';
import logo from './logo.svg';
import './App.css';
import './vis/d3.js';
import './vis/d3.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
        <body className="App-body">
            <h1>Beispieldaten aus TTN Netzwerk</h1>
            <div id="lineGraph" className="row">

            </div>
            <div id="barGraph" className="row">

            </div>
        </body>
    </div>
  );
}

export default App;
