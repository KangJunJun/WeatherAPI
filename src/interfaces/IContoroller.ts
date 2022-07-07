import { Request, Response } from "express";

export interface IController {
  weather(req: Request, res: Response): Promise<void>;
}
