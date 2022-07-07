import AWS from "aws-sdk";
import DatabaseController from "./log";
import { IWeather } from "../interfaces/IOpenWeather";
import { checkTime } from "../common/function";

export default class S3Controller {
  db: DatabaseController;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  constructor() {
    this.db = DatabaseController.getInstance();
  }

  public uploadS3(lat: any, lon: any, data: string): void {
    const params = {
      Bucket: "weatherapicache",
      Key: "cache/" + lat + "," + lon,
      Body: data,
      ContentType: "json",
      CacheControl: "max-age=60",
    };
    this.s3.upload(params, (err: any, data: any): void => {
      if (err) {
        this.db.insertLog("S3 Upload Error", "weater", false, err.message);
      }
      this.db.insertLog("S3 Upload Success", "weater", true);
    });
  }

  public getS3Data = async (lat: any, lon: any): Promise<IWeather | null> => {
    try {
      const params = {
        Bucket: "weatherapicache",
        Key: "cache/" + lat + "," + lon,
      };

      const data = await this.s3.getObject(params).promise();
      this.db.insertLog("S3 Get Cache Success", "weater", true);

      if (checkTime(data.LastModified)) return null;

      const jsonData = data?.Body?.toString("utf-8");
      const weather: IWeather = JSON.parse(jsonData ?? "");

      return weather;
    } catch (error) {
      this.db.insertLog("S3 Get Cache Success", "weater", false, String(error));

      return null;
    }
  };
}
