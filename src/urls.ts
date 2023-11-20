export const otpFlowUrls = {
  baseUrl: '/otp',
  sendOtp: '/sendotp',
  validateOtp: '/validateotp',
};

export const authorizedUrls = '/api';

export const userUrls = {
  getUsersList: `/allUsers`,
  getUserById: `/user/:id`,
  userRoles: `/user/roles`,
  getAllLanguages: `/getAllLanguages`,
  getAllSpecilization: `/getAllSpecializations`,
};

export const masterAuthorizedBaseUrls = '/api/master';

export const masterDataUrls = {
  specializations: '/specializations',
  updateSpecialization: '/specialization/:id',
  languages: '/languages',
  updateLanguage: '/language/:id',
  roles: '/roles',
};
