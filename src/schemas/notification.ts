import mongoose, { Schema } from 'mongoose'
import { INotifications } from '../types/index'

const notificationSchema = new Schema<INotifications>(
  {
    idEmprendedor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idCompany: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    typeNotification: { type: String, required: true },
    idChallenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
    idProposal: { type: Schema.Types.ObjectId, ref: 'Proposal' },
    unview: { type: Boolean, default: false },
  },
)

const Notification = mongoose.model<INotifications>('Notification', notificationSchema)

export default Notification
