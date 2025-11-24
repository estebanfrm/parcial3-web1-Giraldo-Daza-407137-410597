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

// GET /api/prescriptions  -> lista todas con sus items
router.get("/", (req: Request, res: Response) => {
    const result = prescriptions.map((p) => ({
        ...p,
        items: prescriptionItems.filter((pi) => pi.prescriptionId === p.id),
    }));

    res.json(result);
});

// GET /api/prescriptions/:id -> una prescripción con sus items
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const prescription = prescriptions.find((p) => p.id === id);

    if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
    }

    const items = prescriptionItems.filter(
        (pi) => pi.prescriptionId === prescription.id
    );

    res.json({
        ...prescription,
        items,
    });
});

// POST /api/prescriptions -> crear
router.post("/", (req: Request, res: Response) => {
    const { patientId, medicalStaffId, notes, items } = req.body;

    if (!patientId || !medicalStaffId) {
        return res.status(400).json({
            message: "patientId and medicalStaffId are required",
        });
    }

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

    // items son opcionales; si vienen, se validan
    const itemsArray = Array.isArray(items) ? items : [];

    for (const item of itemsArray) {
        if (
            !item.medicationId ||
            !item.schedule ||
            !item.quantity ||
            typeof item.durationDays !== "number"
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

    const createdItems = itemsArray.map((item: any) =>
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

// DELETE /api/prescriptions/:id -> eliminar prescripción y sus items
router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = prescriptions.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Prescription not found" });
    }

    // eliminar prescripción
    prescriptions.splice(index, 1);

    // eliminar items asociados
    for (let i = prescriptionItems.length - 1; i >= 0; i--) {
        if (prescriptionItems[i].prescriptionId === id) {
            prescriptionItems.splice(i, 1);
        }
    }

    res.status(204).send();
});

// GET /api/prescriptions/patient/:patientId -> lista por paciente
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
