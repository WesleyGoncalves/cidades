-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "population" INTEGER NOT NULL,
    "officialLanguage" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "continentId" INTEGER NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");
