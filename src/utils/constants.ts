export const CLOUDINARY = 'Cloudinary';

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
    maximumSpecializationOnlyTwo: 'Specialization must be maximum two',
    certificateMustBeAtleastOne: 'Certificate must be atleast one',
    maximumCertificatedOnlyThree: 'Certificate must be maximum three',
    locationMustBeAtleastOne: 'Location must be atleast one',
    languagesMustBeAtleastOne: 'Languages must be atleast one',
    mobileNumberRequired: 'Mobile number is required',
    mobileNumberMustBe10Digits: 'Mobile number must be 10 digits',
    mobileNumberAlreadyUsed: 'Mobile number already used',
    noUserFound: 'No user found',
    emailCannotBeUpdated: 'Email cannot be updated',
    invalidIdInPreferences: 'Invalid Id in preferences',
    invalidIdInLanguages: 'Invalid Id in languages',
    errorWhileSavingUser: 'Error while saving user',
    mustBeInPattern:
      'Mobilenumber must be in the format +{countrycode}-{number}.',
    dateFormatIncorrect: 'Date format must be DD/MM/YYYY',
    maxLengthForAbout: 'Maximum characters exceeds',
    locationLength: 'Each location must be at most 50 characters',
    specializationIdRequired: 'Specialization is required',
    errorWhileUploadingProfileImage: 'Error while uploading profile image',
    errorWhileUploadingCertificateImage:
      'Error while uploading certificate image',
    dublicateLanguagesDetected: 'Dublicate language detected',
    dublicateSpecializationDetected: 'Dublicate specialization detected',
  },
  messages: {
    userUpdated: 'User Updated',
  },
};

export const slotMessages = {
  errors: {
    slotTimeInvalid: 'Slot time invalid',
    slotAlreadyCreated: 'Slot already created',
    slotsAlreadyCreatedForThisDateUpdateThisDate:
      'Slots already created for this date, update the date to add/remove slots',
    errorWhileUpdatingSlot: 'Error while updating slot',
    errorWhileCancellingSlot: 'Error while cancelling slot',
    idCannotBeChanged: 'Id cannot be changed',
    noSlotFound: 'No slot found',
    atleastOneSlotRequired: 'Atleast one slot required',
    oopsSlotBooked: 'Oops slot got booked, try another slot',

    errorWhileBookingSlot: 'Error while booking slot',
    errorWhileBookingSlotOrMightGotBooked:
      'Error while booking slot or might got booked, try another slot.',
    datesOverLap: 'Dates overlap',
    toTimeMustBeGreaterThanFromTime: 'To time must be greater than from time',
    noSlotsOnTheSelectedDate: 'No slots available on this selected date',
    slotTimingPassedYouCannotCancelTheSlot:
      'Slot timing passed, you cannot cancel the slot.',
    noBookingFound: 'No Booking found',
    slotDateExpired: 'Slot date expired',
    slotMustBeAfterTheDateProvided: 'Slot must be above the provided date',
    slotTimingsMustBeWithinADaysRange:
      'Slot timings must be within a days range',
  },
  messages: {
    slotCreated: 'Slot created successfully',
    slotDeleted: 'Slot deleted successfully',
    slotUpdated: 'Slot updated successfully',

    slotBooked: 'Slot booked successfully',
    slotBookingCancelled: 'Slot booking cancelled.',
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
    imageSizeExceeds: 'Image size exceeds the maximum allowed size of 500KB.',
    invalidImageType:
      'Invalid image type. Allowed types are jpg, jpeg, and png.',
  },
};

export const bookingMessages = {
  errors: {},
  messages: {
    noDetailsAvailable: 'No details available',
  },
};

export const reviewMessages = {
  error: {
    reviewMustBeBelow250Characters: 'Review must be below 250 characters',
    alreadyRatedPleaseUpdateTheExistingReview:
      'Already rated, please update the existing review.',
    errorWhileAddingReview: 'Error while adding review',
    reviewNotFound: 'Review not found',
    errorWhileUpdatingReview: 'Error while updating review',
    errorWhileDeletingReview: 'Error while deleting review',
    youCannotRateWithoutUsingService:
      'You cannot rate without using the service.',
    ratingMustBeBetweenZeroAndFive: 'Rating must be between 0 and 5',
  },
  messages: {
    reviewAddedSuccessfully: 'Review added successfully',
    reviewUpdatedSuccessfully: 'Review updated successfully',
    reviewDeletedSuccessfully: 'Review deleted successfully',
  },
};
