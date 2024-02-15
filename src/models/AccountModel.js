/**
 * @file Defines the Account model.
 * @module AccountModel
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  done: {
    type: Boolean,
    required: true,
    default: false
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const AccountModel = mongoose.model('Account', schema)
