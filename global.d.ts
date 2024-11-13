// global.d.ts

import { PrismaClient } from "@prisma/client";

declare global {
  // Extend globalThis with the `prisma` type definition
  var prisma: PrismaClient | undefined;
}
