/**
 * @file Defines the refresh token model.
 * @module refreshTokenModel
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mongoose from 'mongoose'

// Create a new schema.
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d'
  }
})

// Create and export a model using the schema.
export const refreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema)
