"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/polygons", controllers_1.PolygonController.addPolygon);
router.get("/polygons", controllers_1.PolygonController.getAllPolygon);
router.delete("/polygons/:id", controllers_1.PolygonController.deletePolygon);
/*router.get("/polygons/:id");
router.put("/polygons/:id");
*/
exports.default = router;
//# sourceMappingURL=polygons.routes.js.map