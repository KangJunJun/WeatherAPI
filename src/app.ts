import express from "express";
import openWeatherRouter from "./routes/openWeather";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

app.use("/weather", openWeatherRouter);

export default app;
