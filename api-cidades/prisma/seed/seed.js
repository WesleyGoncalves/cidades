import prisma from "../../src/prisma.js";
import continentsData from "./continents.js";
import countriesData from "./countries.js";
import citiesData from "./cities.js";

async function continents() {
  const continents = await prisma.continent.createMany({
    data: continentsData,
  });

  console.log(`Seeded ${continents.count} continents.`);
}

async function countries() {
  const countries = await prisma.country.createMany({
    data: countriesData,
  });

  console.log(`Seeded ${countries.count} countries.`);
}

async function cities() {
  const cities = await prisma.city.createMany({
    data: citiesData,
  });

  console.log(`Seeded ${cities.count} cities.`);
}

async function main() {
  await continents();
  await countries();
  await cities();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
