import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { text, writerId, feedId } = body;
  res.status(200).end();
  try {
    await prisma.feed.create({
      data: {
        text,
        writerId,
        feedId,
      },
    });
    res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
}
