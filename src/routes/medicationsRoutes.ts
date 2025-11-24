import { Router, Request, Response } from "express";
import { medications, createMedication } from "../data/db";

const router = Router();

// GET /api/medications
router.get("/", (req: Request, res: Response) => {
    res.json(medications);
});

// POST /api/medications
router.post("/", (req: Request, res: Response) => {
    const { name, description, manufacturer, presentation, dosageInfo } =
        req.body;

    if (!name) {
        return res.status(400).json({ message: "name is required" });
    }

    const med = createMedication({
        name,
        description,
        manufacturer,
        presentation,
        dosageInfo,
    });

    res.status(201).json(med);
});

export default router;
