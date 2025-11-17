import mongodb from 'mongodb'

const { ObjectId } = mongodb

  const initialUsers = [
    {
      _id: new ObjectId('100000000000000000000000'),
      email: 'empresa1@mail.com',
      password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
      role: new ObjectId('000000000000000000000000'), // empresa
      name: 'Empresa Alpha',
      phone: '1134567890',
      governmentId: { type: 'cuit', number: '12345678901' },
      description: 'Empresa dedicada a innovación tecnológica',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('100000000000000000000001'),
      email: 'emprendedor1@mail.com',    
      password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
      role: new ObjectId('000000000000000000000001'), // emprendedor
      name: 'Tomás Vignau',
      phone: '1122334455',
      governmentId: { type: 'dni', number: '46700887' },
      description: 'Emprendedor en soluciones sustentables',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

export const up = async (db) => {
  await db.collection('users').insertMany(initialUsers)
}

export const down = async (db) => {
  await db.collection('users').deleteMany({ _id: { $in: initialUsers.map((user) => user._id) } })
}
