import React, { Component } from "react";
import "./App.css";
import Header from "./components/header";
import Aqi from "./components/aqi";
import Forcast from "./components/forcast";

class App extends Component {
  constructor(props) {
    super(props);
    this.aqiKey = `${process.env.REACT_APP_aqi_key}`;
    this.weatherKey = `${process.env.REACT_APP_weather_key}`;
    this.state = {
      aqiData: {},
      weatherData: {},
      geoData: {},
      forcastData: {},
      loaded: false,
      weatherLoaded: false,
      geoLoaded: false,
      forcastLoaded: false
    };
  }

  componentDidMount() {
    this.nearestCity();
    this.currentWeather();
    this.weatherForcast();
    // this.getGeo();
  }

  nearestCity() {
    this.setState({ loaded: false });
    fetch("https://api.airvisual.com/v2/nearest_city?key=" + this.aqiKey)
      .then(response => response.json())
      .then(data => {
        this.setState({
          aqiData: data.data,
          loaded: true
        });
        console.log(this.state.aqiData);
      });
  }

  currentWeather() {
    this.setState({ weatherLoaded: false });
    fetch(
      "https://api.weatherbit.io/v2.0/current?ip=auto&key=" + this.weatherKey
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          weatherData: data.data,
          weatherLoaded: true
        });
      });
  }

  weatherForcast() {
    this.setState({
      forcastLoaded: false
    });
    fetch(
      "https://api.weatherbit.io/v2.0/forecast/daily?ip=auto&key=" +
        this.weatherKey
    )
      .then(response => response.json())
      .then(data => {
        let arr = data.data;
        let reducedArr = arr.slice(0, 7);
        this.setState({
          forcastData: reducedArr,
          forcastLoaded: true
        });
        console.log(this.state.forcastData);
      });
  }

  ///// save for adding geo location updating vs ip ///////

  // getGeo() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(response => {
  //       this.setState({
  //         geoData: response,
  //         geoLoaded: true
  //       });
  //       console.log(this.state.geoData);
  //     });
  //   } else {
  //     console.log("geolocation not available");
  //   }
  // }

  render() {
    return (
      <div className="App">
        <div className="container">
          <Header
            updateBtn={this.componentDidMount.bind(this)}
            aqiData={this.state.aqiData}
            weatherData={this.state.weatherData[0]}
            weatherLoaded={this.state.weatherLoaded}
          />
          <Aqi aqiData={this.state.aqiData} loaded={this.state.loaded} />
          <Forcast
            weatherData={this.state.weatherData[0]}
            forcastData={this.state.forcastData}
            weatherLoaded={this.state.weatherLoaded}
            forcastLoaded={this.state.forcastLoaded}
          />
        </div>
      </div>
    );
  }
}

export default App;
