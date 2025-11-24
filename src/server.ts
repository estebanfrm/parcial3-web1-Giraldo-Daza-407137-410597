import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import patientsRoutes from "./routes/patientsRoutes";
import staffRoutes from "./routes/staffRoutes";
import medicationsRoutes from "./routes/medicationsRoutes";
import prescriptionsRoutes from "./routes/prescriptionsRoutes";

const app = express();

app.use(express.json());

// Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/api/patients", patientsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/prescriptions", prescriptionsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger UI on       http://localhost:${PORT}/api-docs`);
});
