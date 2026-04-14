import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Neautorizovaný přístup.' });
  }

  const userId: string = (session.user as any).id;
  
  try {
    const data = req.body;
    let notesToCreate = [];

    if (Array.isArray(data)) {
      notesToCreate = data;
    } else if (typeof data === 'object' && data !== null) {
      notesToCreate = [data];
    } else {
      return res.status(400).json({ message: 'Neplatný request.' });
    }

    const validNotes = notesToCreate
      .filter((n: any) => typeof n.title === 'string' && n.title.trim().length > 0)
      .map((n: any) => {
        const now = new Date();
        
        let createdAt = now;
        if (n.createdAt) {
          const parsedDate = new Date(n.createdAt);
          if (!isNaN(parsedDate.getTime())) createdAt = parsedDate;
        }

        let updatedAt = now;
        if (n.updatedAt) {
          const parsedDate = new Date(n.updatedAt);
          if (!isNaN(parsedDate.getTime())) updatedAt = parsedDate;
        }

        return {
          title: n.title.trim(),
          content: n.content ? String(n.content) : null,
          userId: userId,
          createdAt: createdAt,
          updatedAt: updatedAt
        };
      });

    if (validNotes.length === 0) {
      return res.status(400).json({ message: 'Neplatný request.' });
    }

    const createdNotes = await prisma.note.createMany({
      data: validNotes,
    });

    return res.status(200).json({ message: `Úspěšně importováno ${createdNotes.count} poznámek.` });
  } catch (error) {
    return res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
  }
}
