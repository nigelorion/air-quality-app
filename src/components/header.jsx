import React, { Component } from "react";
import moment from "moment-timezone";

class Header extends Component {
  timeConverter(time) {
    let timezone = this.props.weatherData.timezone;
    let result = moment
      .utc(time, "HH:mm")
      .tz(timezone)
      .format("h:mm a");
    return result;
  }

  render() {
    return (
      <div className="header">
        <button onClick={this.props.updateBtn}>update</button>
        <h2>
          {this.props.aqiData.city}, {this.props.aqiData.state}
        </h2>
        <p>{moment().format("LLLL")}</p>
        {!this.props.weatherLoaded && (
          <div className="sunriseSet">
            <img
              className="loadingGif"
              src={"/lg.rainy-preloader.gif"}
              alt="loading"
            />
          </div>
        )}
        {this.props.weatherLoaded && (
          <div className="sunriseSet">
            <p>{this.timeConverter(this.props.weatherData.sunrise)} sunrise</p>
            <p>{this.timeConverter(this.props.weatherData.sunset)} sunset</p>
          </div>
        )}
      </div>
    );
  }
}

export default Header;
