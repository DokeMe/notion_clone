import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Neautorizovaný přístup.' });
  }

  const userId: string = (session.user as any).id;
  const { id } = req.query;

  try {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let dataToExport;
    let filename = `notes-export-${dateStr}.json`;

    if (id) {
      const note = await prisma.note.findUnique({ where: { id: String(id) } });
      
      if (!note) {
        return res.status(404).json({ message: 'Neexistující záznam.' });
      }
      
      if (note.userId !== userId) {
        return res.status(403).json({ message: 'Přístup k cizím datům.' });
      }
      
      const { userId: _, ...noteWithoutUserId } = note;
      dataToExport = noteWithoutUserId;
      filename = `note-${id}-${dateStr}.json`;
    } else {
      const notes = await prisma.note.findMany({ where: { userId } });
      dataToExport = notes.map(note => {
        const { userId: _, ...noteWithoutUserId } = note;
        return noteWithoutUserId;
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify(dataToExport, null, 2));

  } catch (error) {
    return res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
  }
}
