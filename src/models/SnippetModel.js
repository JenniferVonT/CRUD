/**
 * @file Defines the Snippet model.
 * @module SnippetModel
 * @author Mats Loock
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  done: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamp: true,
  toObject: {
    getters: true,
    versionKey: false,
    // eslint-disable-next-line jsdoc/require-jsdoc
    transform: (doc, ret) => {
      delete ret._id // Exclude the _id property.
      return ret
    }
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const SnippetModel = mongoose.model('Snippet', schema)
