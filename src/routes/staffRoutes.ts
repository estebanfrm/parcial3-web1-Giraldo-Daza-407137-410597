import { Router, Request, Response } from "express";
import { staff, createStaff } from "../data/db";

const router = Router();

// GET /api/staff  -> lista todo el personal
router.get("/", (req: Request, res: Response) => {
    res.json(staff);
});

// POST /api/staff -> crear
router.post("/", (req: Request, res: Response) => {
    const { firstName, lastName, role, specialty, licenseId } = req.body;

    if (!firstName || !lastName || !role) {
        return res
            .status(400)
            .json({ message: "firstName, lastName and role are required" });
    }

    const member = createStaff({
        firstName,
        lastName,
        role,
        specialty,
        licenseId,
    });

    res.status(201).json(member);
});

// PUT /api/staff/:id -> actualizar
router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = staff.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Staff member not found" });
    }

    const existing = staff[index];
    const updated = {
        ...existing,
        ...req.body,
    };

    staff[index] = updated;
    res.json(updated);
});

// DELETE /api/staff/:id -> eliminar
router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = staff.findIndex((s) => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Staff member not found" });
    }

    staff.splice(index, 1);
    res.status(204).send();
});

// GET /api/staff/:id -> obtener uno por id
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const member = staff.find((s) => s.id === id);
    if (!member) {
        return res.status(404).json({ message: "Staff member not found" });
    }
    res.json(member);
});

export default router;
