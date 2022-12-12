import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import Polygon from "../repositories/Polygon";
import Response from "../services/Response";

export default class PolygonController {
  static async addPolygon(req: ExpressRequest, res: ExpressResponse) {
    let response = new Response();
    try {
      response.setData(await Polygon.addPolygon(req.body));
      response.setMessage("Polygon created!");
    } catch (e) {
      response.setStatus(false);
      response.setMessage("Error while creating Polygon...");
    }
    res.json(response);
  }

  static async getAllPolygon(req: ExpressRequest, res: ExpressResponse) {
    let response = new Response();
    try {
      response.setData(await Polygon.getAllPolygons());
      response.setMessage("Polygons loaded!");
    } catch (e) {
      response.setStatus(false);
      response.setMessage(e);
    }
    res.json(response);
  }

  static async deletePolygon(req: ExpressRequest, res: ExpressResponse) {
    let response = new Response();
    const { id } = req.params;
    try {
      response.setData(await Polygon.deletePolygon(id));
      response.setMessage("Berhasil menghapus polygon");
    } catch (e) {
      response.setStatus(false);
      response.setMessage(e);
    }
    res.json(response);
  }
}
