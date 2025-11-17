import mongoose, { Schema } from 'mongoose'
import { IFollow } from '../types/index'

const followSchema = new Schema<IFollow>(
  {
    idEmprendedor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idCompany: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
)

const Follow = mongoose.model<IFollow>('Follow', followSchema)

export default Follow
