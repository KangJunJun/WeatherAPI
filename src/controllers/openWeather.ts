import axios from "axios";
import { Controller } from "./contoroller";

export default class OpenWeatherController extends Controller {
  public currentWeather = async (lat: any, lon: any): Promise<string> => {
    let resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.APIkey}`
    );

    this.db.insertLog("Success Response", "currentWeather", true);

    return resp.data;
  };

  public forecast3H5D = async (lat: any, lon: any): Promise<string> => {
    let resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.APIkey}`
    );

    this.db.insertLog("Success Response", "forecast3H5D", true);

    return resp.data;
  };
}
