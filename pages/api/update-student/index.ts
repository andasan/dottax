import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { student : { id, firstName, lastName, email, studentId, status }  } = req.body;

  const data = await prisma.studentproto.update({
    where: {
      id
    },
    data: {
      firstName,
      lastName,
      email,
      studentId,
      status
    }
  });

  res.status(200).json({ message: "Student updated", data });

}