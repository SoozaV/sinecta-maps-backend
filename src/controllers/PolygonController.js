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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Polygon_1 = __importDefault(require("../repositories/Polygon"));
const Response_1 = __importDefault(require("../services/Response"));
class PolygonController {
    static addPolygon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new Response_1.default();
            try {
                response.setData(yield Polygon_1.default.addPolygon(req.body));
                response.setMessage("Polygon created!");
            }
            catch (e) {
                response.setStatus(false);
                response.setMessage("Error while creating Polygon...");
            }
            res.json(response);
        });
    }
    static getAllPolygon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new Response_1.default();
            try {
                response.setData(yield Polygon_1.default.getAllPolygons());
                response.setMessage("Polygons loaded!");
            }
            catch (e) {
                response.setStatus(false);
                response.setMessage(e);
            }
            res.json(response);
        });
    }
    static deletePolygon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new Response_1.default();
            const { id } = req.params;
            try {
                response.setData(yield Polygon_1.default.deletePolygon(id));
                response.setMessage("Berhasil menghapus polygon");
            }
            catch (e) {
                response.setStatus(false);
                response.setMessage(e);
            }
            res.json(response);
        });
    }
}
exports.default = PolygonController;
