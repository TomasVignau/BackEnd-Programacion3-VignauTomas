import mongoose, { Schema } from 'mongoose'
import { IChallenge } from '../types/index'

const challengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    idCompany: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true },
    publicationDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema)

export default Challenge
