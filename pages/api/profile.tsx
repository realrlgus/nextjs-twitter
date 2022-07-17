import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { options } from "../../util";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    if (!userData) {
      throw Error("Please Login");
    }

    res.json(userData);
  } catch (e) {
    res.status(500).end();
  }
}
export default withIronSessionApiRoute(handler, options);
