import React, { Component } from "react";

class Aqi extends Component {
  airQualityStatus(aqiVal) {
    let answer;
    if (aqiVal <= 60) {
      answer = "Get outside and breathe that fresh air!";
    } else if (aqiVal > 60 && aqiVal < 130) {
      answer = "Take it easy, the air qaulity is less than ideal!";
    } else if (aqiVal > 130 && aqiVal < 200) {
      answer = "It is getting bad, stay inside!";
    } else {
      answer = "Don't even bother breathing...";
    }
    return answer;
  }

  render() {
    return (
      <div className="aqiBox">
        {!this.props.loaded && (
          <img
            className="loadingGif"
            src={"/lg.rainy-preloader.gif"}
            alt="loading"
          />
        )}
        {this.props.loaded && (
          <div>
            <p className="temp">
              {this.props.aqiData.current.pollution.aqius}
              <span className="degrees"> air quality</span>
            </p>
            <p>
              {this.airQualityStatus(
                this.props.aqiData.current.pollution.aqius
              )}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Aqi;
