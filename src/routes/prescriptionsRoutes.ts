import { Router, Request, Response } from "express";
import {
    prescriptions,
    prescriptionItems,
    createPrescription,
    createPrescriptionItem,
    patients,
    staff,
    medications,
} from "../data/db";

const router = Router();

// POST /api/prescriptions
router.post("/", (req: Request, res: Response) => {
    const { patientId, medicalStaffId, notes, items } = req.body;

    if (
        !patientId ||
        !medicalStaffId ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return res.status(400).json({
            message:
                "patientId, medicalStaffId and items (non empty array) are required",
        });
    }

    // Validaciones básicas
    const patientExists = patients.some((p) => p.id === patientId);
    const staffExists = staff.some((s) => s.id === medicalStaffId);

    if (!patientExists) {
        return res.status(400).json({ message: "Patient does not exist" });
    }
    if (!staffExists) {
        return res
            .status(400)
            .json({ message: "Medical staff does not exist" });
    }

    for (const item of items) {
        if (
            !item.medicationId ||
            !item.schedule ||
            !item.quantity ||
            !item.durationDays
        ) {
            return res.status(400).json({
                message:
                    "Each item requires medicationId, schedule, quantity and durationDays",
            });
        }
        const medExists = medications.some((m) => m.id === item.medicationId);
        if (!medExists) {
            return res.status(400).json({
                message: `Medication with id ${item.medicationId} does not exist`,
            });
        }
    }

    const prescription = createPrescription({
        patientId,
        medicalStaffId,
        notes,
    });

    const createdItems = items.map((item: any) =>
        createPrescriptionItem({
            prescriptionId: prescription.id,
            medicationId: item.medicationId,
            schedule: item.schedule,
            quantity: item.quantity,
            durationDays: item.durationDays,
        })
    );

    return res.status(201).json({
        ...prescription,
        items: createdItems,
    });
});

// GET /api/patients/:patientId/prescriptions
router.get("/patient/:patientId", (req: Request, res: Response) => {
    const patientId = Number(req.params.patientId);

    const patientExists = patients.some((p) => p.id === patientId);
    if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
    }

    const patientPrescriptions = prescriptions.filter(
        (p) => p.patientId === patientId
    );
    const result = patientPrescriptions.map((p) => ({
        ...p,
        items: prescriptionItems.filter((pi) => pi.prescriptionId === p.id),
    }));

    res.json(result);
});

export default router;
