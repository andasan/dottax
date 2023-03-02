import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { students, emailTemplates } from "./seeds/students";

async function main() {
  // await prisma.student.deleteMany();

  await prisma.emailTemplate.create({
    data: emailTemplates
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
