import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { writerId, text } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        text,
        writerId,
      },
    });
    console.log(post);
    res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
}
