import { sequelize } from "../database";
import { PolygonModel } from "../models";
import { CreatePolygonBodyType, PolygonFeatureType, PolygonFeatureCollectionType } from "../schemas/polygon.schema";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { QueryTypes } from "sequelize";

export class Polygon {
  /**
   * Create a new polygon
   * @param polygon - GeoJSON Feature with Polygon geometry
   * @returns Created polygon as GeoJSON Feature
   * @throws BadRequestError if polygon data is invalid
   */
  static async addPolygon(polygon: CreatePolygonBodyType): Promise<PolygonFeatureType> {
    try {
      // Generate ID if not provided
      const polygonId = polygon.id || `polygon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Transform geometry to match Sequelize's expected format
      const geometryForDb = {
        type: polygon.geometry.type,
        coordinates: polygon.geometry.coordinates,
      };
      
      const data = await PolygonModel.create({
        id: polygonId,
        name: polygon.properties?.name || "",
        area: polygon.properties?.area || 0,
        geom: geometryForDb,
      });

      const response: PolygonFeatureType = {
        id: data.dataValues.id,
        type: "Feature",
        properties: {
          id: data.dataValues.id,
          area: data.dataValues.area,
          name: data.dataValues.name,
        },
        // Cast geometry to match schema type (Sequelize returns type as string, schema expects literal "Polygon")
        geometry: data.dataValues.geom as PolygonFeatureType['geometry'],
      };
      return response;
    } catch (error: any) {
      // Handle Sequelize unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestError(`Polygon with ID ${polygon.id} already exists`);
      }
      // Handle validation errors
      if (error.name === 'SequelizeValidationError') {
        throw new BadRequestError(error.message || 'Invalid polygon data');
      }
      throw error;
    }
  }

  /**
   * Get all polygons (maximum 100)
   * @returns GeoJSON FeatureCollection with all polygons
   */
  static async getAllPolygons(): Promise<PolygonFeatureCollectionType> {
    try {
      const query = `
        SELECT json_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(json_agg(ST_AsGeoJSON(t.*)::json), '[]'::json)
        ) as json_build_object
        FROM (
          SELECT * FROM polygons 
          ORDER BY id DESC 
          LIMIT 100
        ) AS t;
      `;
      
      // Sequelize.query con QueryTypes.SELECT devuelve directamente un array de objetos
      type QueryResultRow = { json_build_object: PolygonFeatureCollectionType };
      const results = await sequelize.query<QueryResultRow>(query, {
        type: QueryTypes.SELECT,
      });
      
      // results es un array con un solo elemento (la fila del SELECT)
      if (Array.isArray(results) && results.length > 0 && results[0]?.json_build_object) {
        const featureCollection = results[0].json_build_object;
        // Asegurar que features sea un array
        if (!featureCollection.features || !Array.isArray(featureCollection.features)) {
          featureCollection.features = [];
        }

        // PostGIS ST_AsGeoJSON coloca las columnas no geométricas en "properties"
        // pero no siempre rellena el campo "id" a nivel de Feature.
        // Para cumplir con el schema (id requerido), copiamos properties.id si falta.
        featureCollection.features = featureCollection.features.map((feature: any) => {
          if (!feature.id && feature.properties?.id) {
            feature.id = String(feature.properties.id);
          }
          return feature;
        });

        return featureCollection;
      }
      
      return {
        type: 'FeatureCollection',
        features: []
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch polygons: ${error.message}`);
    }
  }

  /**
   * Delete a polygon by ID
   * @param polygonId - Polygon ID to delete
   * @returns Number of deleted polygons (0 or 1)
   * @throws NotFoundError if polygon doesn't exist
   */
  static async deletePolygon(polygonId: string): Promise<number> {
    try {
      // Verificar que el polígono existe antes de intentar eliminarlo
      const polygon = await PolygonModel.findByPk(polygonId);
      if (!polygon) {
        throw new NotFoundError(`Polygon with ID ${polygonId} not found`);
      }

      const deleted = await PolygonModel.destroy({
        where: { id: polygonId },
      });
      
      return deleted;
    } catch (error: any) {
      // Re-throw NotFoundError
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to delete polygon: ${error.message}`);
    }
  }
}
