import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, password } = req.body;

  if (!name || !password || password.length < 3) {
    return res.status(400).json({ message: 'Jméno a heslo (min. 3 znaky) jsou povinné.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      return res.status(409).json({ message: 'Uživatel s tímto jménem již existuje.' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Uživatel úspěšně vytvořen.', userId: user.id });
  } catch (error) {
    console.error("Registrace Error:", error);
    res.status(500).json({ message: 'Něco se pokazilo na serveru.', error: (error as Error).message });
  }
}
