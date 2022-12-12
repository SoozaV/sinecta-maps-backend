import sequelize from "../database/database";
import PolygonModel from "../models/Polygon";
import GeoJSON from "geojson";

export default class Polygon {
  static async addPolygon(polygon: GeoJSON.Feature<GeoJSON.Polygon>) {
    const data = await PolygonModel.create({
      id: polygon.id,
      name: polygon.properties?.name || "",
      area: polygon.properties?.area || 0,
      geom: polygon.geometry,
    });

    const response = {
      id: data.dataValues.id,
      type: "Feature",
      properties: {
        id: data.dataValues.id,
        area: data.dataValues.area,
        name: data.dataValues.name,
      },
      geometry: data.dataValues.geom,
    };
    return response;
  }

  static async getAllPolygons() {
    const query = `SELECT
                        json_build_object (
                            'type', 'FeatureCollection',
                            'features', json_agg(ST_AsGeoJSON(t.*)::json)
                        )
                    FROM 
                        polygons AS t;`;
    const data = await sequelize.query(query);
    return data;
  }

  static async deletePolygon(polygonId: any) {
    const data = await PolygonModel.destroy({
      where: { id: polygonId },
    });
    return data;
  }
}
