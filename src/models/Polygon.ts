import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

// ============================================
// Polygon Model Interface
// ============================================

interface PolygonAttributes {
  id: string;
  name: string;
  area: number;
  geom: {
    type: string;
    coordinates: number[][][];
    crs?: {
      type: string;
      properties: {
        name: string;
      };
    };
  };
}

interface PolygonCreationAttributes extends Optional<PolygonAttributes, 'name' | 'area'> {
  id: string;
  geom: PolygonAttributes['geom'];
}

// ============================================
// Polygon Model
// ============================================

export const PolygonModel = sequelize.define<Model<PolygonAttributes, PolygonCreationAttributes>>(
  "polygon",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    area: {
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: 0,
    },
    geom: {
      type: DataTypes.GEOMETRY("POLYGON", 4326),
      allowNull: false,
    },
  },
  {
    tableName: 'polygons',
    hooks: {
      beforeSave: (polygon: any) => {
        // Ensure CRS is set for PostGIS compatibility
        if (polygon.dataValues?.geom && !polygon.dataValues.geom.crs) {
          polygon.dataValues.geom.crs = {
            type: "name",
            properties: {
              name: "EPSG:4326",
            },
          };
        }
      },
    },
  }
);
