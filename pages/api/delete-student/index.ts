import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;

  await prisma.studentproto.delete({
    where: {
      id
    }
  });

  res.status(200).json({ message: "Student deleted" });

}