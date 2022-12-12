import { DataTypes } from "sequelize";
import { sequelize } from "../database/database";

const Polygon = sequelize.define(
  "polygon",
  {
    /*id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },*/
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.REAL,
    },
    geom: {
      type: DataTypes.GEOMETRY("POLYGON", 4326),
    },
  },
  {
    hooks: {
      beforeSave: (polygon, options) => {
        console.log("POLYGOn", polygon);
        if (!polygon.dataValues.geom.crs) {
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

export default Polygon;
