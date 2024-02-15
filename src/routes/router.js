/**
 * @file Defines the main router.
 * @
 * dule router
 * @author Mats Loock
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetRouter } from './snippetRouter.js'
import { router as accountRouter } from './accountRouter.js'

export const router = express.Router()

console.log('router running...')
router.use('./', homeRouter)
router.use('./snippets', snippetRouter)
router.use('./account', accountRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
