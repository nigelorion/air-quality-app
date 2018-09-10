import React, { Component } from 'react';
import './App.css';
import Moment from 'react-moment';
import moment from 'moment-timezone';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.aqiKey = `${process.env.REACT_APP_aqi_key}`;
    this.weatherKey = `${process.env.REACT_APP_weather_key}`;

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
    console.log(this.weatherKey)
  }
  nearestCity() {
  
    this.setState({loaded: false});
    fetch("https://api.airvisual.com/v2/nearest_city?key=" + this.aqiKey)
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

    this.setState({weatherLoaded: false});
    fetch("https://api.weatherbit.io/v2.0/current?ip=auto&key=" + this.weatherKey)
    .then(response => response.json())
    .then(data => {
      this.setState({
        weatherData: data.data,
        weatherLoaded: true
      })
      console.log(this.state.weatherData[0])
    })

  }

  timeConverter(time) {
  
    let timezone = this.state.weatherData[0].timezone;

    let result = moment.utc(time, 'HH:mm').tz(timezone).format('h:mm a');

    return result
  
  }


  convertToF(celsius) {

    let fahrenheit = (celsius * (9/5)) + 32;
    fahrenheit = Math.round(fahrenheit);
    return fahrenheit;

  }
  render() {
    return (
      <div className="App"> 
        <div className="header">
          <h2>{this.state.aqiData.city}, {this.state.aqiData.state}</h2>
          <button onClick={this.componentDidMount.bind(this)}>update</button>
        </div>
        <div className="boxContainer">
          <div className="aqiBox">
            {!this.state.loaded &&
              <img src={"/lg.rainy-preloader.gif"}alt="loading"></img>
        
            }
            {this.state.loaded &&
              <div>
                <p  className="temp">{this.state.aqiData.current.pollution.aqius}<span className="degrees">  air quality</span></p>
              </div>
            }
          </div>
          <div className="weatherBox">
            {!this.state.weatherLoaded &&
              <img src={"/lg.rainy-preloader.gif"} alt="loading"></img>
            }
            {this.state.weatherLoaded &&
              <div>
                <p className="temp">{this.convertToF(this.state.weatherData[0].app_temp)}<span className="degrees">  degrees</span></p>
                <p>{this.timeConverter(this.state.weatherData[0].sunrise)} sunrise</p>
                <p>{this.timeConverter(this.state.weatherData[0].sunset)} sunset</p>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
