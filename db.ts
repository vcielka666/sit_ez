import prisma from "./src/lib/prisma";

export const db = global.prisma || prisma;

if (process.env.NODE_ENV !== "production") global.prisma = db;