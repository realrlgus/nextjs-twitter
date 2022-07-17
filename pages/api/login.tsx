import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { options } from "../../util";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { user, password },
  } = req;

  try {
    const userData = await prisma.user.findFirst({
      where: {
        name: user,
        password,
      },
    });

    if (!userData) {
      throw Error("Invalid User");
    }
    req.session.user = {
      id: userData.id,
    };

    await req.session.save();

    res.status(200).end();
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e.message);
  }
}
export default withIronSessionApiRoute(handler, options);
