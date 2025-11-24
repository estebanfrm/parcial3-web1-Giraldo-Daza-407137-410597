import { Router, Request, Response } from "express";
import { patients, createPatient } from "../data/db";

const router = Router();

// GET /api/patients
router.get("/", (req: Request, res: Response) => {
    res.json(patients);
});

// GET /api/patients/:id
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const patient = patients.find((p) => p.id === id);
    if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
});

// POST /api/patients
router.post("/", (req: Request, res: Response) => {
    const { firstName, lastName, documentNumber, birthDate, phone, address } =
        req.body;

    if (!firstName || !lastName || !documentNumber) {
        return res
            .status(400)
            .json({
                message: "firstName, lastName and documentNumber are required",
            });
    }

    const patient = createPatient({
        firstName,
        lastName,
        documentNumber,
        birthDate,
        phone,
        address,
    });

    res.status(201).json(patient);
});

// PUT /api/patients/:id
router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const patientIndex = patients.findIndex((p) => p.id === id);
    if (patientIndex === -1) {
        return res.status(404).json({ message: "Patient not found" });
    }

    const existing = patients[patientIndex];
    const updated = {
        ...existing,
        ...req.body,
    };

    patients[patientIndex] = updated;
    res.json(updated);
});

// DELETE /api/patients/:id
router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Patient not found" });
    }

    patients.splice(index, 1);
    res.status(204).send();
});

export default router;
