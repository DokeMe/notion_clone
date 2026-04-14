Yet again, todolist - klon notionu

Instalace
stahneme projekt a nainstalujte balicky:
npm install

Nastaveni prostredi
Vytvorime si soubor .env podle vzoru v .env.example
Musime vyplnit DATABASE_URL (pripojeni do postgresql databaze) a NEXTAUTH_SECRET

Spusteni a databaze
Pro vytvoreni tabulek v databazi spustime:
npx prisma migrate dev

Pro naplneni databaze testovacimi daty spustime:
npm run seed

Potom muzeme spustit samotnou aplikaci:
npm run dev

Prihlasovaci udaje
prihlaseni jako testovaci uzivatel:
jmeno: demo
heslo: demo123

Import a export
Aplikace umi nacitat a stahovat poznamky ve formatu json
Exportovat vsechny poznamky muzeme pres tlacitko v levem menu
Jednu konkretni poznamku vyexportujeme pres tlacitko primo nahore v editoru po jejim otevreni
Import se dela pres tlacitko v levem menu, kde vybereme json soubor a on se nahraje do uctu