import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body: { likePostId, likeUserId },
  } = req;
  try {
    const likeList = await prisma.like.findFirst({
      where: {
        likePostId,
        likeUserId,
      },
    });
    const isLike = likeList === null;

    if (isLike) {
      await prisma.like.create({
        data: {
          likePostId,
          likeUserId,
        },
      });
    } else {
      await prisma.like.delete({
        where: {
          id: likeList?.id,
        },
      });
    }
    res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
}
