import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { name: 'demo' },
    update: {},
    create: {
      name: 'demo',
      password: password,
      notes: {
        create: [
          {
            title: 'Vítejte v Notionu!',
            content: JSON.stringify([
              {
                type: 'heading',
                content: [{ type: 'text', text: 'Tohle je první poznámka', styles: { bold: true } }],
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Zde můžete psát svůj text, formátovat ho nebo vkládat obrázky.', styles: {} }],
              }
            ])
          },
          {
            title: 'Úkoly na dnešek',
            content: JSON.stringify([
              {
                type: 'bulletListItem',
                content: [{ type: 'text', text: 'Nainstalovat balíčky', styles: {} }],
              },
              {
                type: 'bulletListItem',
                content: [{ type: 'text', text: 'Zkontrolovat API', styles: {} }],
              }
            ])
          }
        ]
      }
    }
  });

  console.log('Seed úspěšně dokončen!');
  console.log('-------------------------');
  console.log('Demo uživatel: demo');
  console.log('Heslo: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
