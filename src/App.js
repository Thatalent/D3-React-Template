import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <BarChart data={[{x: "2015", y: 5}, {x: "2016", y: 10}, {x: "2017", y: 7}, { x: "2018", y: 8 }]} width={500} yAxisSettings={{position:"left"}}/>
        <LineChart data={[{x: "2015", y: 5}, {x: "2016", y: 10}, {x: "2017", y: 7}, { x: "2018", y: 8 }]} width={500} yAxisSettings={{position:"left"}}/>
      </div>
    );
  }
}

export default App;
