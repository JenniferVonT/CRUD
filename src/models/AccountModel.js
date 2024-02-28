/**
 * @file Defines the Account model.
 * @module AccountModel
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be a minimum of 10 characters long']
  }
}, {
  timestamps: true,
  versionKey: false
})

schema.add(BASE_SCHEMA)

// Hash and salt the password before saving the account.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

// Create a model using the schema.
export const AccountModel = mongoose.model('Account', schema)
