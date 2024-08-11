enum ValidationErrorMessage {
  REQUIRED = 'This field is required',
  INVALID_EMAIL = 'Invalid email',
  INVALID_PASSWORD = 'Invalid password',
  PASSWORDS_DO_NOT_MATCH = 'Passwords do not match',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  EMAIL_PENDING = 'Email is pending verification'
}

export default ValidationErrorMessage;
