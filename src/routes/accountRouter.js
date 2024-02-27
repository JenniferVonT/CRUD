/**
 * @file Defines the account router.
 * @module accountRouter
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

// src/routes/snippetRouter.js
import express from 'express'
import { AccountController } from '../controllers/AccountController.js'

export const router = express.Router()

const controller = new AccountController()

// Provide req.user to the route if :user is present in the route path.
router.param('user', (req, res, next, user) => controller.loadAccount(req, res, next, user))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create', (req, res, next) => controller.createAccount(req, res, next))

router.get('/:user/delete', (req, res, next) => controller.delete(req, res, next))
router.post('/:user/delete', (req, res, next) => controller.deleteAccount(req, res, next))
