// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "./generated/prisma/index.js";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, we attach the client to the global object (globalThis)
  // to prevent multiple instances being created when Node.js reloads modules.
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
