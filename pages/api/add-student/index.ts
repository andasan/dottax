import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { student } = req.body;

  const data = await prisma.studentproto.create({
    data: student,
  });
  res.status(200).json({ message: "Students added", data });

}