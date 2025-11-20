import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const cities = await prisma.city.findMany();
  res.status(200).json(cities);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const city = await prisma.city.findUnique({
    where: { id: parseInt(id) },
  });

  if (!city) {
    return res.status(404).json({ error: "City not found" });
  }
  res.status(200).json(city);
});

router.post("/", async (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(422).json({ error: "Name is required" });
  }
  const country = await prisma.country.findUnique({
    where: { id: parseInt(req.body.countryId) },
  });

  if (!country) {
    return res.status(422).json({ error: "Country does not exist" });
  }

  const city = await prisma.city.create({
    data: {
      name: name,
      population: req.body.population,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      countryId: req.body.countryId,
    },
  });

  res.status(201).json(city);
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  let city = await prisma.city.findUnique({
    where: { id: parseInt(id) },
  });
  if (!city) {
    return res.status(404).json({ error: "City not found" });
  }

  if (req.body.countryId) {
    const country = await prisma.country.findUnique({
      where: { id: parseInt(req.body.countryId) },
    });

    if (!country) {
      return res.status(422).json({ error: "Country does not exist" });
    }
  }

  await prisma.city.update({
    where: { id: parseInt(id) },
    data: {
      name: req.body.name || city.name,
      population: req.body.population || city.population,
      latitude: req.body.latitude || city.latitude,
      longitude: req.body.longitude || city.longitude,
      countryId: req.body.countryId || city.countryId,
    },
  });

  city = await prisma.city.findUnique({
    where: { id: parseInt(id) },
  });

  res.status(200).json(city);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  const city = await prisma.city.findUnique({
    where: { id: parseInt(id) },
  });

  if (!city) {
    return res.status(404).json({ error: "City not found" });
  }

  await prisma.city.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).json();
});

export default router;
