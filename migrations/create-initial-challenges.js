import mongodb from 'mongodb'
const { ObjectId } = mongodb

const initialChallenges = [
  {
    _id: new ObjectId('200000000000000000000000'),
    title: 'Desafío de Energía Renovable',
    description: 'Optimizar el uso de energía solar en pequeños comercios.',
    idCompany: new ObjectId('100000000000000000000000'),
    category: 'Energía',
    publicationDate: new Date('2025-01-01'),
    expirationDate: new Date('2025-12-31'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('200000000000000000000001'),
    title: 'Desafío de Packaging Sustentable',
    description: 'Alternativas ecológicas para empaques de productos frágiles.',
    idCompany: new ObjectId('100000000000000000000000'),
    category: 'Sustentabilidad',
    publicationDate: new Date('2025-02-15'),
    expirationDate: new Date('2025-08-15'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const up = async (db) => {
  await db.collection('challenges').insertMany(initialChallenges)
}

export const down = async (db) => {
  await db.collection('challenges').deleteMany({
    _id: { $in: initialChallenges.map(c => c._id) },
  })
}
