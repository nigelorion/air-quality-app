import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.apiKey = "pq68pi9kvatpF6Yof"
    this.weatherApiKey = "3d406b2a3a9a4218a4abb5827a949634"

  

    this.state = {
      aqiData: {},
      weatherData: {},
      loaded: false,
      weatherLoaded: false
    };
  }
  componentDidMount() {
    this.nearestCity()
    this.weatherForcast()
  }
  nearestCity() {
    console.log(this.apiKey)
    this.setState({loaded: false});
    fetch("https://api.airvisual.com/v2/nearest_city?key=" + this.apiKey)
    .then(response => response.json())
    .then(data => {
      console.log(data.data)
      this.setState({ 
        aqiData: data.data,
        loaded: true,
        state: "Oregon",
        city: "Portland"
      });
    })
  }
  weatherForcast() {
    console.log(this.weatherApiKey)
    this.setState({weatherLoaded: false});
    fetch("https://api.weatherbit.io/v2.0/current?ip=auto&key=" + this.weatherApiKey)
    .then(response => response.json())
    .then(data => {
      this.setState({
        weatherData: data.data,
        weatherLoaded: true
      })
      console.log(this.state.weatherData[0])
    })
  }
  searchcity() {
    

  }


  convertToF(celsius) {
    let fahrenheit;
    fahrenheit = (celsius * (9/5)) + 32;
    fahrenheit = Math.round(fahrenheit);
    console.log(fahrenheit)
    return fahrenheit;
  }
  render() {
    return (
      <div className="App"> 
        <div className="header">
          <h2>{this.state.aqiData.city}, {this.state.aqiData.state}</h2>
          <button onClick={this.nearestCity.bind(this)}>update</button>

        </div>
        <div className="boxContainer">
          <div className="aqiBox">
            {!this.state.loaded &&
              <img src={"/lg.rainy-preloader.gif"}></img>
            }
            {this.state.loaded &&
              <div>
                <p  className="temp">{this.state.aqiData.current.pollution.aqius}<span className="degrees">  air quality</span></p>
              </div>
            }
          </div>
          {this.state.weatherLoaded &&
          <div className="weatherBox">
            <p className="temp">{this.convertToF(this.state.weatherData[0].app_temp)}<span className="degrees">  degrees</span></p>
          </div>
          }

        </div>
        
        {/* <div className="searchBox">
        <input value={this.state.city} onChange={this.searchcity}></input>
        <button>search</button>
        </div> */}
     
  
      </div>
    );
  }
}

export default App;
