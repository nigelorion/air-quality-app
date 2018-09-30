import React, { Component } from 'react';
import './App.css';
import moment from 'moment-timezone';

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
    this.nearestCity()
    this.currentWeather()
    this.weatherForcast()
    // this.getGeo();
  }

  nearestCity() {
    this.setState({loaded: false});
    fetch("https://api.airvisual.com/v2/nearest_city?key=" + this.aqiKey)
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        aqiData: data.data,
        loaded: true
      });
    })
  }

  currentWeather() {
    this.setState({weatherLoaded: false});
    fetch("https://api.weatherbit.io/v2.0/current?ip=auto&key=" + this.weatherKey)
    .then(response => response.json())
    .then(data => {
      this.setState({
        weatherData: data.data,
        weatherLoaded: true
      })
    })
  }

  weatherForcast() {
    this.setState({
      forcastLoaded: false
    });
    fetch("https://api.weatherbit.io/v2.0/forecast/daily?ip=auto&key=" + this.weatherKey)
    .then(response => response.json())
    .then(data => {
      let arr = data.data;
      let reducedArr = arr.slice(0,7);
      this.setState({
        forcastData: reducedArr,
        forcastLoaded: true
      })
      console.log(this.state.forcastData)
    })
  }

  timeConverter(time) {
    let timezone = this.state.weatherData[0].timezone;
    let result = moment.utc(time, 'HH:mm').tz(timezone).format('h:mm a')
    return result
  }

  dayConverter(date) {
    let formatDate = moment(date).format('LLLL');
    let dateArr = formatDate.split(' ')
    let weekday = dateArr[0].replace(',', '');
    return weekday;
  }

  convertToF(celsius) {
    let fahrenheit = (celsius * (9/5)) + 32;
    fahrenheit = Math.round(fahrenheit);
    return fahrenheit;
  }

  getGeo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(response => {
        this.setState({
          geoData: response,
          geoLoaded: true
        })
        console.log(this.state.geoData)
      })
    } else {
      console.log("geolocation not available")
    }
  }

  airQualityStatus(aqiVal) {
    let answer;
    if (aqiVal <= 60) {
      answer = "Get outside and breathe that fresh air!"
    } else if (aqiVal > 60 && aqiVal < 130) {
      answer = "Take it easy, the air qaulity is less than ideal!"
    } else if (aqiVal > 130 && aqiVal < 200) {
      answer = "It is getting bad, stay inside!"
    } else {
      answer = "Don't even bother breathing..."
    }
    return answer;
  }

  render() {
    return (
      <div className="App"> 
        <div className="container">
          <div className="header">
            <button onClick={this.componentDidMount.bind(this)}>update</button>
            <h2>{this.state.aqiData.city}, {this.state.aqiData.state}</h2>
            <p>{moment().format('LLLL')}</p>
            {!this.state.weatherLoaded &&
              <div className="sunriseSet">
                <img className="loadingGif" src={"/lg.rainy-preloader.gif"} alt="loading"></img>
              </div>
            }
            {this.state.weatherLoaded &&
              <div className="sunriseSet">
                <p>{this.timeConverter(this.state.weatherData[0].sunrise)} sunrise</p>
                <p>{this.timeConverter(this.state.weatherData[0].sunset)} sunset</p>
              </div>
            }
            {/* {this.state.geoLoaded && 
              <div>
                <p>{this.state.geoData.coords.longitude}</p>
                <p>{this.state.geoData.coords.latitude}</p>
              </div>
            } */}
          </div>
          <div className="aqiBox">
            {!this.state.loaded &&
              <img className="loadingGif" src={"/lg.rainy-preloader.gif"} alt="loading"></img>
            }
            {this.state.loaded &&
              <div>
                <p className="temp">{this.state.aqiData.current.pollution.aqius}<span className="degrees">  air quality</span></p>
                <p>{this.airQualityStatus(this.state.aqiData.current.pollution.aqius)}</p>
              </div>
            }
          </div>
          <div className="weatherBox">
            {!this.state.weatherLoaded &&
              <img className="loadingGif" src={"/lg.rainy-preloader.gif"} alt="loading"></img>
            }
            {this.state.weatherLoaded &&
              <div className="weatherBoxInner">
                <p className="temp">{this.convertToF(this.state.weatherData[0].app_temp)}<span className="degrees">  degrees</span></p>
                <p className="conditions">{this.state.weatherData[0].weather.description}</p>
                <div className="forcastBox">
                  {!this.state.forcastLoaded &&
                    <img className="loadingGif" src={"/lg.rainy-preloader.gif"} alt="loading"></img>
                  }
                  {this.state.forcastLoaded &&
                    <div className="daysBox">
                      {this.state.forcastData.map((day, i) => {
                        return (
                          <div key={i} className="day">  
                            <p className="dayData" key={i}>{this.dayConverter(day.datetime)}</p>
                            <p className="dayData dayTemp">{this.convertToF(day.max_temp)}<span className="lowTemp">{this.convertToF(day.min_temp)}</span></p> 
                            <p className="dayData">{day.weather.description}</p>
                          </div> 
                        )
                      })
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          
        </div>
      </div>
    );
  }
}

export default App;
