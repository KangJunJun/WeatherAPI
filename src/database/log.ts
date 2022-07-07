import { IWeather } from "../interfaces/IOpenWeather";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { checkTime } from "../common/function";
import { ILog, ICallLog } from "../interfaces/ILog";
import { Controller } from "../controllers/contoroller.js";
import dayjs from "dayjs";

export default class LogController {
  private static instance: LogController;
  config = new Config("myDataBase", true, false, "/");
  db = new JsonDB(this.config);

  private constructor() {
    const isExistLogDB: boolean = this.db.exists("/log");

    if (!isExistLogDB) {
      this.db.push("/log/logList[]", {});
      this.db.push("/log/callLog[]", {});
    }
  }

  static getInstance() {
    if (!LogController.instance) {
      LogController.instance = new LogController();
    }
    return LogController.instance;
  }

  public insertLog(
    title: string,
    apiType: string,
    success?: boolean,
    error?: string
  ) {
    const log: ILog = {
      title: title,
      apiType: apiType,
      time: new Date(),
      success: success,
      error: error,
    };
    this.db.push(`/log/logList[]`, log, true);
  }

  public updateCallLog(apiType: string) {
    const prevlog: ICallLog = this.db
      .getData(`/log/callLog`)
      ?.find((x: ICallLog) => x.route === apiType);

    if (prevlog) {
      const id = this.db.getIndex(`/log/callLog`, apiType, "route");
      prevlog.count++;
      prevlog.time = new Date();
      this.db.push(`/log/callLog[${id}]`, prevlog, false);
    } else {
      const log: ICallLog = {
        route: apiType,
        time: new Date(),
        count: 1,
      };
      this.db.push(`/log/callLog[]`, log, true);
    }
  }
}
