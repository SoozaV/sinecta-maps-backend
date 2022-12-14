import { Router } from "express";
import { PolygonController } from "../controllers";
const router = Router();

router.post("/polygons", PolygonController.addPolygon);
router.get("/polygons", PolygonController.getAllPolygon);
router.delete("/polygons/:id", PolygonController.deletePolygon);
/*router.get("/polygons/:id");
router.put("/polygons/:id");
*/

export default router;
