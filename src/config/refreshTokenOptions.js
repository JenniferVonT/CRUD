/**
 * @file This module contains the creation of the refresh token for the session middleware.
 * @module refreshToken
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import jwt from 'jsonwebtoken'
import { RefreshToken } from '../models/refreshTokenModel.js'

const SECRET_KEY = process.env.REFRESH_TOKEN_SECRET

/**
 * A class that handles the refresh tokens.
 */
export class RefreshTokenOptions {
/**
 * Generates a new refresh token.
 *
 * @returns {object} - a refresh token.
 */
  async generateRefreshToken () {
    const newRefreshToken = jwt.sign({ type: 'refresh' }, SECRET_KEY, { expiresIn: 1000 * 60 * 60 * 24 })
    await RefreshToken.create({ token: newRefreshToken })
    return newRefreshToken
  }

  /**
   * Periodically check the refresh token and restart the application if needed.
   */
  async scheduleTokenCheck () {
    setInterval(async () => {
      const refreshToken = await RefreshToken.findOne().sort({ createdAt: -1 }).exec()

      if (!refreshToken || !this.isValidRefreshToken(refreshToken.token)) {
        const newToken = await this.generateRefreshToken()
        console.log('New refresh token generated:', newToken)
        process.exit()
      }
    }, 5 * 60 * 1000) // Check every 5min
  }

  /**
   * Checks wether the token is valid or not.
   *
   * @param {object} token - The token to check.
   * @returns {boolean} - true or false.
   */
  async isValidRefreshToken (token) {
    try {
      // Check if the token is valid to the secret key.
      const decoded = jwt.verify(token, SECRET_KEY)

      // If the token is not a refresh token return false.
      if (decoded.type !== 'refresh') {
        console.error('Invalid token type')
        return false
      }

      return true
    } catch (error) {
      console.error('Invalid token:', error.message)
      return false
    }
  }
}
