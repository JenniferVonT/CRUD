/**
 * @file Defines the AccountController class.
 * @module AccountController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { AccountModel } from '../models/AccountModel.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Provide req.user to the route if :user is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} user - The username for the account to load.
   */
  async loadAccount (req, res, next, user) {
    try {
      // Get the account.
      const account = await AccountModel.findById(user)

      // If the account is not found, throw an error.
      if (!account) {
        const error = new Error('The account you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the account to req.
      req.user = account

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    res.render('account/create')
  }

  /**
   * Creates a new account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createAccount (req, res) {
    try {
      const { username, password, done } = req.body

      await AccountModel.create({
        username,
        password,
        done: done === 'on'
      })

      req.session.flash = { type: 'success', text: 'The account was created successfully.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./account/create')
    }
  }

  /**
   * Returns a HTML form for updating an account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      res.render('account/update', { viewData: req.user.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates the account password.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updateAccount (req, res) {
    try {
      if ('password' in req.body) req.user.password = req.body.password
      if ('done' in req.body) req.user.done = req.body.done === 'on'

      if (req.user.isModified()) {
        await req.user.save()
        req.session.flash = { type: 'success', text: 'The password was updated successfully.' }
      } else {
        req.session.flash = { type: 'info', text: 'The password was not updated because there was nothing to update.' }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting an account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      res.render('account/delete', { viewData: req.user.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified account.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deletePost (req, res) {
    try {
      await req.user.deleteOne()

      req.session.flash = { type: 'success', text: 'The account was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./account/delete')
    }
  }
}
