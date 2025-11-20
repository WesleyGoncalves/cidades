import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const continents = await prisma.continent.findMany();
  res.status(200).json(continents);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const continent = await prisma.continent.findUnique({
    where: { id: parseInt(id) },
  });

  if (!continent) {
    return res.status(404).json({ error: "Continent not found" });
  }
  res.status(200).json(continent);
});

router.post("/", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.status(422).json({ error: "Name and description are required" });
  }
  const continent = await prisma.continent.create({
    data: {
      name: name,
      description: description,
    },
  });

  res.status(201).json(continent);
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  let continent = await prisma.continent.findUnique({
    where: { id: parseInt(id) },
  });
  if (!continent) {
    return res.status(404).json({ error: "Continent not found" });
  }

  await prisma.continent.update({
    where: { id: parseInt(id) },
    data: {
      name: req.body.name || continent.name,
      description: req.body.description || continent.description,
    },
  });

  continent = await prisma.continent.findUnique({
    where: { id: parseInt(id) },
  });

  res.status(200).json(continent);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ error: "ID is required" });
  }

  const continent = await prisma.continent.findUnique({
    where: { id: parseInt(id) },
  });

  if (!continent) {
    return res.status(404).json({ error: "Continent not found" });
  }

  await prisma.continent.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).json();
});

export default router;
