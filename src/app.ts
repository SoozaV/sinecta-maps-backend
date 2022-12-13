import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/polygons.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => res.send("Express Typescript on Vercel"));
app.get("/ping", (_req: Request, res: Response) => res.send("pong 🏓"));

app.use("/api", routes);

export default app;
