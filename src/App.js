import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from './components/charts/BarChart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <BarChart data={[{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 7}, { x: 5, y: 8 }]} width={500}/>
      </div>
    );
  }
}

export default App;
