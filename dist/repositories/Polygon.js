"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const database_1 = require("../database");
const models_1 = require("../models");
class Polygon {
    static addPolygon(polygon) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.PolygonModel.create({
                id: polygon.id,
                name: ((_a = polygon.properties) === null || _a === void 0 ? void 0 : _a.name) || "",
                area: ((_b = polygon.properties) === null || _b === void 0 ? void 0 : _b.area) || 0,
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
        });
    }
    static getAllPolygons() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT
                        json_build_object (
                            'type', 'FeatureCollection',
                            'features', json_agg(ST_AsGeoJSON(t.*)::json)
                        )
                    FROM 
                        polygons AS t;`;
            const data = yield database_1.sequelize.query(query);
            return data;
        });
    }
    static deletePolygon(polygonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.PolygonModel.destroy({
                where: { id: polygonId },
            });
            return data;
        });
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map