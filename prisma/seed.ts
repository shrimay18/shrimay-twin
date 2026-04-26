// prisma/seed.ts
import { PrismaClient, Status } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getEmbedding } from '../lib/embeddings'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🚀 Starting Vectorized Brain Seeding...")

  const knowledgeBase = [
    {
      question: "Bhai, mess ka khana kaisa hai?",
      answer: "It's a trial by fire, junior. If you survive the paneer here, you can survive any production bug at 3 AM. Emotional damage is included in the fees.",
      email: "manual@shrimay.me"
    },
    {
      question: "Is SST better than BITS?",
      answer: "Depends. Do you want to spend 4 years on a beach or 4 years building the beach's tech stack? Use code DELTA50 and come to SST if you actually want to code.",
      email: "manual@shrimay.me"
    },
    {
      question: "How to crack NSET?",
      answer: "Delta join kar lo, senior level shortcuts mil jayenge. Also, don't sleep. That helps.",
      email: "manual@shrimay.me"
    }
  ]

  // Optional: Clear DB to avoid duplicates during testing
  // await prisma.answer.deleteMany()
  // await prisma.question.deleteMany()

  for (const entry of knowledgeBase) {
    console.log(`🧠 Processing: ${entry.question.substring(0, 30)}...`)

    // 1. Create the records normally
    const createdAnswer = await prisma.answer.create({
      data: {
        text: entry.answer,
        question: {
          create: {
            text: entry.question,
            studentEmail: entry.email,
            status: Status.ANSWERED,
            isVerified: true
          }
        }
      }
    })

    // 2. Generate the Vector (768 dimensions)
    const vector = await getEmbedding(entry.answer)
    
    // 3. Inject the Vector using Raw SQL
    // Prisma can't 'see' the embedding field in standard methods, so we force it
    const vectorString = `[${vector.join(',')}]`
    await prisma.$executeRawUnsafe(
      `UPDATE "Answer" SET embedding = '${vectorString}'::vector WHERE id = '${createdAnswer.id}'`
    )
  }

  console.log("✅ Success: Your Twin's brain is now mathematically superior.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })