import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'kabid.teknologi@himasti.org' },
    update: {},
    create: {
      name: 'Kabid Teknologi',
      email: 'kabid.teknologi@himasti.org',
      password: hashedPassword,
    },
  })
  
  console.log('Super Admin created:', superAdmin)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
