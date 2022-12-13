"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
const Polygon = database_1.default.define("polygon", {
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
exports.default = Polygon;
