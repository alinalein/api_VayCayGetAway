//sets up a single Prisma client instance 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export default prisma;