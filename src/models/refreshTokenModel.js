/**
 * @file Defines the refresh token model.
 * @module refreshTokenModel
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a new schema.
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1000 * 60 * 60 * 24 // 1 day
  }
})

refreshTokenSchema.add(BASE_SCHEMA)

// Create and export a model using the schema.
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
