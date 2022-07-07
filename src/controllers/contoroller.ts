import { Request, Response } from "express";
import LogController from "../database/log";
import { IController } from "../interfaces/IContoroller";
import S3Controller from "../database/s3";
import { isNum } from "../common/function";

export abstract class Controller implements IController {
  db: LogController;

  constructor() {
    this.db = LogController.getInstance();
  }
  // 추상 메서드 정의
  public abstract currentWeather(lat: any, lon: any): Promise<string>;
  public abstract forecast3H5D(lat: any, lon: any): Promise<string>;

  public weather = async (req: Request, res: Response): Promise<void> => {
    try {
      this.db.insertLog("Weather API Calling", "weather");

      const lat = req.query.lat;
      const lon = req.query.lon;

      if (!lat || !lon || !isNum(lat.toString()) || !isNum(lon.toString())) {
        this.db.insertLog(
          "Parameter Null Exception",
          "weather",
          false,
          "lat or lon is null"
        );
        res.status(400).json({
          error: "lat or lon is null",
        });
        return;
      }

      const s3 = new S3Controller();
      let data = await s3.getS3Data(lat, lon);

      if (data) {
        this.db.insertLog("Complete S3", "weather", true);
        res.status(201).json({
          weather: data,
        });
        return;
      }

      data = {
        currentWeather: await this.currentWeather(lat, lon),
        forecast3H5D: await this.forecast3H5D(lat, lon),
      };

      s3.uploadS3(lat, lon, JSON.stringify(data));
      this.db.insertLog("Complete API", "weather", true);
      res.status(201).json({
        weather: data,
      });
    } catch (e) {
      var error = new Error(String(e));
      this.db.insertLog(
        error.name,
        "weather",
        false,
        error.message + error.stack
      );

      res.status(400).json({
        error: error.message,
      });
    }
  };
}
