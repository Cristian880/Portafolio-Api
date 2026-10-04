import bcrypt from 'bcrypt'
import prisma from '../src/lib/prisma'

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('Define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD en tu .env antes de correr el seed')
  }

  const passwordHash = await bcrypt.hash(password, 12) // 12 rounds de salting es un buen balance entre seguridad y performance son cuántas veces se aplica el algoritmo de hasheo.

  const admin = await prisma.adminUser.upsert ({
    where: { email },
    update: {},
    create: { email, passwordHash },
  }) //upsert si se corre el seed dos veces por error, no crashea con un error de email duplicado — simplemente confirma que el admin ya existe.

  console.log(`Admin listo: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })