import express from "express";
import dotenv from "dotenv";
import routerContinents from "./routers/continents.js";
import routerCountries from "./routers/countries.js";
import routerCities from "./routers/cities.js";
import cors from "../config/cors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors);

app.use(express.json());

app.use("/api/continents", routerContinents);
app.use("/api/countries", routerCountries);
app.use("/api/cities", routerCities);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Something went wrong on the server",
    details: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
