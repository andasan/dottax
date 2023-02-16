import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { student : { id, name, email, studentId, status }  } = req.body;

  console.log(id, name, email, studentId, status);
  

  await prisma.student.update({
    where: {
      id
    },
    data: {
      name,
      email,
      studentId,
      status
    }
  });

  res.status(200).json("Student updated");
  
}