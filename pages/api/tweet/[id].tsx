import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { options } from "../../../util";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.id === "undefined") {
    res.status(500).end();
    return;
  }
  try {
    const tweet = await prisma.post.findFirst({
      where: {
        id: parseInt(req.query.id as string, 10),
      },
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
    res.json(tweet);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

export default withIronSessionApiRoute(handler, options);
