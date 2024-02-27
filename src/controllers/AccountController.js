/**
 * @file Defines the AccountController class.
 * @module AccountController
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { AccountModel } from '../models/AccountModel.js'
import bcrypt from 'bcrypt'

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
   * Returns an html showing the profile information.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        account: (await AccountModel.find())
          .map(account => account.toObject())
      }

      res.render('account/index', { viewData })
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
      const { username, password } = req.body

      // Hash and salt the password for encryption.
      const hashedPassword = await bcrypt.hash(password, 10)

      await AccountModel.create({
        username,
        password: hashedPassword
      })

      req.session.flash = { type: 'success', text: 'The account was created successfully.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('account/login')
    }
  }

  /**
   * Get the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login (req, res) {
    res.render('account/login')
  }

  /**
   * Handles the login verification.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async loginAccount (req, res) {
    try {
      const { username, password } = req.body
      const user = await AccountModel.findOne({ username })

      if (!user) {
        const error = new Error('The username and/or password is incorrect.')
        error.status = 404
        throw error
      }

      // Compare the entered password with the stored password.
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        const error = new Error('The username and/or password is incorrect.')
        error.status = 401 // Unauthorized
        throw error
      }

      // Set the user in the session.
      req.session.user = user

      // Redirect.
      res.redirect('../snippets')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('login')
    }
  }

  /**
   * Handles the logout.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logout (req, res) {
    // Remove the session.
    req.session.destroy()

    res.redirect('/')
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
      res.redirect('/account/delete')
    }
  }
}
