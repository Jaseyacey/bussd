/**
 * Email validation using a standard email regex pattern
 * @param email - The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @param password - The password to validate
 * @returns boolean indicating if the password meets all requirements
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
return hasUpperCase && hasLowerCase && hasNumbers;
};

/**
 * Get password requirements message
 * @returns string describing password requirements
 */
export const getPasswordRequirements = (): string => {
  return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
};

/**
 * Validate confirm password matches
 * @param password - The original password
 * @param confirmPassword - The confirmation password
 * @returns boolean indicating if passwords match
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
}; 