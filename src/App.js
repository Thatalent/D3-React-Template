import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './components/charts/LineChart';
import BarChart from './components/charts/BarChart';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customData: false,
      data:  [{x: "2015", y: 5}, {x: "2016", y: 10}, {x: "2017", y: 7}, { x: "2018", y: 8 }]
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  updateData(event) {
    const target = event.target;
    const index = target.attributes.index.value;
    let data = this.state.data;
    let name = target.name;
    let value = target.value;
    if(!isNaN(value)){
      value = value-0;
    }
    data[index][name]=value;
    this.setState({
      date: data
    });
  }

  render() {
    let data = this.state.data;
    let length = 1;
    var customInput = '';
    let customData = this.state.customData;
    if(customData){
      customInput = data.map((entry, index) => 
        <form key={index}>
          <label>x:</label><input name="x" key={"x"+index} value={entry.x} index={index} onChange={this.updateData}/>
          <label>y:</label><input name="y" key={"y"+index} value={entry.y} index={index} onChange={this.updateData}/>
        </form>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <BarChart data={this.state.data} width={500} yAxisSettings={{position:"left"}}/>
        <LineChart data={this.state.data} width={500} yAxisSettings={{position:"left"}}/>
        <div>
        <label>Use custom input
          <input type='checkbox' checked={customData} name="customData" onChange={this.handleInputChange}/>
        </label>
          {customInput}
        </div>
      </div>
    );
  }
}

export default App;
