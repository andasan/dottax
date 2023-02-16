import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { students } from "./seeds/students";

async function main() {
  await prisma.student.deleteMany();

  await prisma.student.createMany({
    data: await students()
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
