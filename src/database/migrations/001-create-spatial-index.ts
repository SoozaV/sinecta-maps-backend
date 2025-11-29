import { sequelize } from "../database";
import { QueryTypes } from "sequelize";

/**
 * Create spatial index for polygon geometry column
 * Uses GiST index for efficient spatial queries
 */
export async function createSpatialIndex(): Promise<void> {
  try {
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_polygon_geom 
      ON polygons USING GIST (geom);
    `, {
      type: QueryTypes.RAW,
    });
    console.log('Spatial index created successfully');
  } catch (error: any) {
    // Ignore error if index already exists (PostgreSQL returns error for IF NOT EXISTS in some cases)
    if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
      console.log('Spatial index already exists, skipping...');
      return;
    }
    console.error('Error creating spatial index:', error);
    throw error;
  }
}

