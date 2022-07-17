import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { options } from "../../util";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lists = await prisma.post.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      _count: {
        select: { feeds: true, liked: true },
      },
      writer: {
        select: {
          name: true,
        },
      },
      liked: {
        select: {
          id: true,
        },
        where: {
          likeUserId: req.session.user?.id,
        },
      },
    },
  });
  if (!lists) {
    res.json({});
    return;
  }
  res.json(lists);
}

export default withIronSessionApiRoute(handler, options);
