/**
 * @file Defines the authentication and authorization class.
 * @module Auth
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

/**
 * Represents an Authorization/Authentication class.
 */
export default class Auth {
  /**
   * Checks if the user is Authorized...
   * if the specific account have access to certain content.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  isAuthorized (req, res, next) {
    // CODE HERE.
  }

  /**
   * Checks if the user is Authentic...
   * if the user is logged in.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} - moves on to the next method if user is authenticated.
   */
  isAuthenticated (req, res, next) {
    // CODE HERE.
  }
}
