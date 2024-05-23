import {PrismaClient } from '@prisma/client'
import { Return } from '@prisma/client/runtime/library'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: undefined | Return<typeof prismaClientSingleton>
}
const db = globalThis.prisma ?? prismaClientSingleton()

export default db

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db