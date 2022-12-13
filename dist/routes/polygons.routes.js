"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PolygonController_1 = __importDefault(require("../controllers/PolygonController"));
const router = (0, express_1.Router)();
router.post("/polygons", PolygonController_1.default.addPolygon);
router.get("/polygons", PolygonController_1.default.getAllPolygon);
router.delete("/polygons/:id", PolygonController_1.default.deletePolygon);
/*router.get("/polygons/:id");
router.put("/polygons/:id");
*/
exports.default = router;
//# sourceMappingURL=polygons.routes.js.map