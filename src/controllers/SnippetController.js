/**
 * @file Defines the SnippetController class.
 * @module SnippetController
 * @author Mats Loock
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import { SnippetModel } from '../models/SnippetModel.js'

/**
 * Encapsulates a controller.
 */
export class SnippetController {
  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the snippet to load.
   */
  async loadSnippetDocument (req, res, next, id) {
    try {
      // Get the snippet document.
      const snippetDoc = await SnippetModel.findById(id)

      // If the snippet document is not found, throw an error.
      if (!snippetDoc) {
        const error = new Error('The Snippet you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the snippet document to req.
      req.doc = snippetDoc

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippets: (await SnippetModel.find().sort({ createdAt: -1 }))
          .map(snippet => snippet.toObject())
      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createPost (req, res) {
    try {
      const { description } = req.body
      const user = req.session.user

      await SnippetModel.create({
        description,
        author: user.username
      })

      req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/create')
    }
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      // Check if the session user is authorized to view this.
      if (await this.checkAuthorization(req)) {
        res.render('snippets/update', { viewData: req.doc.toObject() })
      } else {
        req.session.flash = { type: 'danger', text: 'You are not authorized to update someone elses snippet.' }
        res.redirect('..')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async updatePost (req, res) {
    try {
      // Check if the user i authorized to do this.
      if (await this.checkAuthorization(req)) {
        if ('description' in req.body) req.doc.description = req.body.description

        if (req.doc.isModified()) {
          await req.doc.save()
          req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
        } else {
          req.session.flash = { type: 'info', text: 'The snippet was not updated because there was nothing to update.' }
        }
        res.redirect('..')
      } else {
        req.session.flash = { type: 'danger', text: 'You are not authorized to update someone elses snippet.' }
        res.redirect('..')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      // Check if the user is authorized to view this.
      if (await this.checkAuthorization(req)) {
        res.render('snippets/delete', { viewData: req.doc.toObject() })
      } else {
        req.session.flash = { type: 'danger', text: 'You are not authorized to delete someone elses snippet.' }
        res.redirect('..')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deletePost (req, res) {
    try {
      // Check if the user is authorized to do this.
      if (await this.checkAuthorization(req)) {
        await req.doc.deleteOne()

        req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
        res.redirect('..')
      } else {
        req.session.flash = { type: 'danger', text: 'You are not authorized to delete someone elses snippet.' }
        res.redirect('..')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }

  /**
   * Checks if the snippet author is the same as the session user.
   *
   * @param {object} req - The request object to check.
   * @returns {boolean} - true or false
   */
  async checkAuthorization (req) {
    const user = req.session.user
    return req.doc.author.includes(user.username)
  }
}
