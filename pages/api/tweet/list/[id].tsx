import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { options } from "../../../../util";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.id === "undefined") {
    res.status(500).end();
    return;
  }
  const feeds = await prisma.feed.findMany({
    where: {
      feedId: parseInt(req.query.id as string, 10),
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      writer: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!feeds) {
    res.json({});
    return;
  }
  res.json(feeds);
}

export default withIronSessionApiRoute(handler, options);
