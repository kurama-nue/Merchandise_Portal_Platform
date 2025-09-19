import bcrypt from 'bcrypt';

/**
 * Bcrypt configuration for secure password hashing
 * 
 * This module provides standardized functions for password hashing and verification
 * using bcrypt with 12 rounds of salt generation for enhanced security.
 */

// Number of salt rounds for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt with 12 rounds
 * 
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - The plain text password to check
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if the password matches, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};