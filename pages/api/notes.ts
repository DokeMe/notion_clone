import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Neautorizovaný přístup.' });
  }

  const userId: string = (session.user as any).id;

  switch (req.method) {
    case 'GET':
      try {
        const notes = await prisma.note.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(notes);
      } catch (error) {
        res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        const { title, content } = req.body;

        if (!title) {
          return res.status(400).json({ message: 'Neplatný request.' });
        }

        const newNote = await prisma.note.create({
          data: {
            title,
            content,
            userId: userId,
          },
        });
        res.status(201).json(newNote);
      } catch (error) {
        res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
      }
      break;
      
    case 'PUT':
      try {
        const { id, title, content } = req.body;

        if (!id || !title) {
          return res.status(400).json({ message: 'Neplatný request.' });
        }

        const note = await prisma.note.findUnique({ where: { id: String(id) } });
        
        if (!note) {
          return res.status(404).json({ message: 'Neexistující záznam.' });
        }
        
        if (note.userId !== userId) {
          return res.status(403).json({ message: 'Přístup k cizím datům.' });
        }

        const updatedNote = await prisma.note.update({
          where: { id: String(id) },
          data: { title, content }
        });
        
        res.status(200).json(updatedNote);
      } catch (error) {
        res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ message: 'Neplatný request.' });
        }

        const note = await prisma.note.findUnique({ where: { id: String(id) } });
        
        if (!note) {
          return res.status(404).json({ message: 'Neexistující záznam.' });
        }
        
        if (note.userId !== userId) {
          return res.status(403).json({ message: 'Přístup k cizím datům.' });
        }

        await prisma.note.delete({
          where: { id: String(id) },
        });
        
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: 'Chyba serveru.', error: (error as Error).message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end();
  }
}
