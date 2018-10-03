import React, { Component } from "react";
import moment from "moment-timezone";

class Forcast extends Component {
  dayConverter(date) {
    let formatDate = moment(date).format("LLLL");
    let dateArr = formatDate.split(" ");
    let weekday = dateArr[0].replace(",", "");
    return weekday;
  }

  convertToF(celsius) {
    let fahrenheit = celsius * (9 / 5) + 32;
    fahrenheit = Math.round(fahrenheit);
    return fahrenheit;
  }

  render() {
    return (
      <div className="weatherBox">
        {!this.props.weatherLoaded && (
          <img
            className="loadingGif"
            src={"/lg.rainy-preloader.gif"}
            alt="loading"
          />
        )}
        {this.props.weatherLoaded && (
          <div className="weatherBoxInner">
            <p className="temp">
              {this.convertToF(this.props.weatherData.app_temp)}
              <span className="degrees"> degrees</span>
            </p>
            <p className="conditions">
              {this.props.weatherData.weather.description}
            </p>
            <div className="forcastBox">
              {!this.props.forcastLoaded && (
                <img
                  className="loadingGif"
                  src={"/lg.rainy-preloader.gif"}
                  alt="loading"
                />
              )}
              {this.props.forcastLoaded && (
                <div className="daysBox">
                  {this.props.forcastData.map((day, i) => {
                    return (
                      <div key={i} className="day">
                        <p className="dayData" key={i}>
                          {this.dayConverter(day.datetime)}
                        </p>
                        <p className="dayData dayTemp">
                          {this.convertToF(day.max_temp)}
                          <span className="lowTemp">
                            {this.convertToF(day.min_temp)}
                          </span>
                        </p>
                        <p className="dayData">{day.weather.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Forcast;
