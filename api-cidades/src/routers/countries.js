import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const countries = await prisma.country.findMany();
  res.status(200).json(countries);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });

  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }
  res.status(200).json(country);
});

router.post("/", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.status(422).json({ error: "Name and description are required" });
  }
  const continent = await prisma.continent.findUnique({
    where: { id: parseInt(req.body.continentId) },
  });

  if (!continent) {
    return res.status(422).json({ error: "Continent does not exist" });
  }

  const country = await prisma.country.create({
    data: {
      name: name,
      description: description,
      population: req.body.population,
      officialLanguage: req.body.officialLanguage,
      currency: req.body.currency,
      continentId: req.body.continentId,
    },
  });

  res.status(201).json(country);
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  let country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });
  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }

  if (req.body.continentId) {
    const continent = await prisma.continent.findUnique({
      where: { id: parseInt(req.body.continentId) },
    });

    if (!continent) {
      return res.status(422).json({ error: "Continent does not exist" });
    }
  }

  await prisma.country.update({
    where: { id: parseInt(id) },
    data: {
      name: req.body.name || country.name,
      description: req.body.description || country.description,
      population: req.body.population || country.population,
      officialLanguage: req.body.officialLanguage || country.officialLanguage,
      currency: req.body.currency || country.currency,
      continentId: req.body.continentId || country.continentId,
    },
  });

  country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });

  res.status(200).json(country);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  const country = await prisma.country.findUnique({
    where: { id: parseInt(id) },
  });

  if (!country) {
    return res.status(404).json({ error: "Country not found" });
  }

  await prisma.country.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).json();
});

export default router;
