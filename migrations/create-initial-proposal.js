import mongodb from 'mongodb'
const { ObjectId } = mongodb

const initialProposals = [
  {
    _id: new ObjectId('300000000000000000000000'),
    title: 'Panel solar compacto',
    description: 'Paneles solares modulares y de bajo costo.',
    idCompany: new ObjectId('100000000000000000000000'),
    idChallenge: new ObjectId('200000000000000000000000'),
    idUser: new ObjectId('100000000000000000000001'),
    category: 'Energía',
    publicationDate: new Date('2025-03-01'),
    state: 'pendiente',
    valoration: 4,
    feedback: 'Propuesta prometedora',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('300000000000000000000001'),
    title: 'Envases biodegradables de caña',
    description: 'Solución de packaging biodegradable a base de bagazo de caña.',
    idCompany: new ObjectId('100000000000000000000000'),
    idChallenge: new ObjectId('200000000000000000000001'),
    idUser: new ObjectId('100000000000000000000001'),
    category: 'Sustentabilidad',
    publicationDate: new Date('2025-03-10'),
    state: 'aceptada',
    valoration: 5,
    feedback: 'Excelente innovación',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const up = async (db) => {
  await db.collection('proposals').insertMany(initialProposals)
}

export const down = async (db) => {
  await db.collection('proposals').deleteMany({
    _id: { $in: initialProposals.map(p => p._id) },
  })
}
