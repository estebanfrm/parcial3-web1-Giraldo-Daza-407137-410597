import { Router, Request, Response } from "express";
import { medications, createMedication } from "../data/db";

const router = Router();

// GET /api/medications  -> lista todos
router.get("/", (req: Request, res: Response) => {
    res.json(medications);
});

// GET /api/medications/:id -> uno por id
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const med = medications.find((m) => m.id === id);

    if (!med) {
        return res.status(404).json({ message: "Medication not found" });
    }

    res.json(med);
});

// POST /api/medications -> crear
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

// PUT /api/medications/:id -> actualizar
router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = medications.findIndex((m) => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Medication not found" });
    }

    const existing = medications[index];
    const updated = {
        ...existing,
        ...req.body,
    };

    medications[index] = updated;
    res.json(updated);
});

// DELETE /api/medications/:id -> eliminar
router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = medications.findIndex((m) => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Medication not found" });
    }

    medications.splice(index, 1);
    res.status(204).send();
});

export default router;
