import { Schema, model } from 'mongoose';
// import { IRefreshToken } from '../interfaces/refreshToken.interface';

const refreshTokenSchema = new Schema({
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;    