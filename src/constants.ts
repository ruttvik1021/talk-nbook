export const otpMessages = {
  errors: {
    otpExpired: 'Otp expired',
    noUserFound: 'No user found',
    wrongOtp: 'Wrong otp',
    activeSeesionFound:
      'Active Session Found, please logout from other sessions',
    userInactive: 'User inactive',
    errorCreatingUser: 'Error creating user',
    contactAdmin: 'Contact admin for more help.',
    somethingWentWrong: 'Something went wrong',
    orpAlreadySent: 'Otp already sent',
    emailMustBeValid: 'Email must be valid',
  },
  messages: {
    otpSent: 'Otp sent successfully',
  },
};

export const languagesMessages = {
  errors: {
    languageExist: 'Language already exist',
    errorWhileAddingLanguage: 'Error while adding language',
  },
  messages: {
    addedSuccessfully: 'Language Added Successfully',
  },
};

export const categoryMessages = {
  errors: {
    categoryExist: 'Category already exist',
    errorWhileAddingCategory: 'Error while adding category',
  },
  messages: {
    addedSuccessfully: 'Category Added Successfully',
  },
};

export const userMessages = {
  errors: {
    emailMustBeValid: 'Email must be valid',
  },
};

export const jwtConstants = {
  secret: process.env.jwtSecret!,
  expiresIn: process.env.jwtExpiresIn!,
};

export const authenticationConstants = {
  errors: {
    missingAuthHeaders: 'Unauthorized - Missing Authorization Header',
    invalidAuthHeaderFormat:
      'Unauthorized - Invalid Authorization Header Format',
  },
};
