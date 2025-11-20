-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_continentId_fkey" FOREIGN KEY ("continentId") REFERENCES "Continent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
