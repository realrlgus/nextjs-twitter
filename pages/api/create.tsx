import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body: { user, password },
  } = req;

  try {
    await prisma.user.create({
      data: {
        name: user,
        password,
      },
    });
    res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
}
