"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
exports.PolygonModel = database_1.sequelize.define("polygon", {
    /*id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },*/
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    area: {
        type: sequelize_1.DataTypes.REAL,
    },
    geom: {
        type: sequelize_1.DataTypes.GEOMETRY("POLYGON", 4326),
    },
}, {
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
});
//# sourceMappingURL=Polygon.js.map