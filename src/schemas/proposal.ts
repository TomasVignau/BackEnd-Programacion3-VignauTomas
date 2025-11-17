import mongoose, { Schema } from 'mongoose'
import { IProposal } from '../types/index'

const proposalSchema = new Schema<IProposal>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    idCompany: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idChallenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true },
    publicationDate: { type: Date, required: true },
    state: { type: String, required: true, trim: true, default: 'pendiente' },
    valoration: { type: Number, default: 0, min: 0, max: 5 },
    feedback: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Proposal = mongoose.model<IProposal>('Proposal', proposalSchema)

export default Proposal
