import { Router, Request, Response } from "express";
import { staff, createStaff } from "../data/db";

const router = Router();

// GET /api/staff
router.get("/", (req: Request, res: Response) => {
    res.json(staff);
});

// POST /api/staff
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

// GET /api/staff/:id
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const member = staff.find((s) => s.id === id);
    if (!member) {
        return res.status(404).json({ message: "Staff member not found" });
    }
    res.json(member);
});

export default router;
