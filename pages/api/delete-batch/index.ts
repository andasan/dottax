import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { batch }: { batch: number } = req.body;

    await prisma.student.deleteMany({
        where: {
            batch: Number(batch)
        }
    });

    res.status(200).json({ message: "Student deleted" });

}