import express from "express";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import patientsRoutes from "./routes/patientsRoutes";
import staffRoutes from "./routes/staffRoutes";
import medicationsRoutes from "./routes/medicationsRoutes";
import prescriptionsRoutes from "./routes/prescriptionsRoutes";

const app = express();

// HABILITAR CORS PARA EL FRONTEND (VUE EN 5173)
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE",
    })
);

app.use(express.json());

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/patients", patientsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/prescriptions", prescriptionsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger UI on http://localhost:${PORT}/api-docs`);
});
