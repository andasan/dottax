import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { remapRecords } = req.body;

  const data = await prisma.studentproto.createMany({
    data: remapRecords,
    skipDuplicates: true,
  });

  res.status(200).json({ message: "Students added", data });

}