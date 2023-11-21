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
    otpNotSentYet: 'Otp not sent yet',
  },
  messages: {
    otpSent: 'Otp sent successfully',
  },
};

export const languagesMessages = {
  errors: {
    languageExist: 'Language already exist',
    errorWhileAddingLanguage: 'Error while adding language',
    errorWhileUpdatingLanguage: 'Error while updating language',
    errorWhileDeletingLanguage: 'Error while deleting language',
    languageNotFound: 'Language not found',
    usedByUser: 'Used by user',
    mustNotBeEmpty: 'Must not be empty',
  },
  messages: {
    addedSuccessfully: 'Language Added Successfully',
    updatedSuccessfully: 'Language Updated Successfully',
    deletedSuccessfully: 'Language Deleted Successfully',
    languageUsedDeactivatedLanguage: 'Language Used, Deactived Language',
  },
};

export const specializationMessages = {
  errors: {
    specializationExist: 'Specialization already exist',
    errorWhileAddingSpecialization: 'Error while adding specialization',
    errorWhileUpdatingSpecialization: 'Error while updating specialization',
    errorWhileDeletingSpecialization: 'Error while deleting specialization',
    specializationNotFound: 'Specialization not found',
    usedByUser: 'Specialization used by user',
    mustNotBeEmpty: 'Must not be empty',
  },
  messages: {
    addedSuccessfully: 'Specialization Added Successfully',
    updatedSuccessfully: 'Specialization Updated Successfully',
    deletedSuccessfully: 'Specialization Deleted Successfully',
    specializationUsedDeactivatedLanguage:
      'Specialization Used, Deactived Specialization',
  },
};

export const userMessages = {
  errors: {
    emailMustBeValid: 'Email must be valid',
    specializationMustBeAtleastOne: 'Specialization must be atleast one',
    languagesMustBeAtleastOne: 'Languages must be atleast one',
    mobileNumberRequired: 'Mobile number is required',
    mobileNumberMustBe10Digits: 'Mobile number must be 10 digits',
    noUserFound: 'No user found',
    emailCannotBeUpdated: 'Email cannot be updated',
    invalidIdInPreferences: 'Invalid Id in preferences',
    invalidIdInLanguages: 'Invalid Id in languages',
    errorWhileSavingUser: 'Error while saving user',
    mustBeInPattern:
      'Mobilenumber must be in the format +{countrycode}-{number}.',
    dateFormatIncorrect: 'Date format must be DD/MM/YYYY ',
    maxLengthForAbout: 'Maximum characters exceeds',
  },
  messages: {
    userUpdated: 'User Updated',
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

export const commonMessages = {
  errors: {
    notValidId: 'Id not valid',
  },
};
