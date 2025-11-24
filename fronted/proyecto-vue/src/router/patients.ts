import { Router } from "express";

const router = Router();

let patients: any[] = [];
let idCounter = 1;

// GET — traer todos
router.get("/", (req, res) => {
  res.json(patients);
});

// GET — traer uno por ID
router.get("/:id", (req, res) => {
  const p = patients.find(x => x.id == req.params.id);
  if (!p) return res.status(404).json({ error: "Paciente no encontrado" });
  res.json(p);
});

// POST — crear
router.post("/", (req, res) => {
  const newPatient = { id: idCounter++, ...req.body };
  patients.push(newPatient);
  res.json(newPatient);
});

// PUT — editar
router.put("/:id", (req, res) => {
  const index = patients.findIndex(x => x.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Paciente no encontrado" });

  patients[index] = { ...patients[index], ...req.body };
  res.json(patients[index]);
});

// DELETE — eliminar
router.delete("/:id", (req, res) => {
  const index = patients.findIndex(x => x.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Paciente no encontrado" });

  patients.splice(index, 1);
  res.json({ message: "Paciente eliminado" });
});

export default router;
