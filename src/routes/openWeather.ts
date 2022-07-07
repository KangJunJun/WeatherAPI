import express, { Application } from "express";
import OpenWeatherController from "../controllers/openWeather";

const router = express.Router();
const controller = new OpenWeatherController();

router.get("/openWeather/", controller.weather);

export default router;
