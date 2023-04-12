const UserController = {
  signUp: require('./signUp'),

  signIn: require('./signIn'),

  googleLogin: require('./googleLogin'),

  getUser: require('./getUser'),

  forgotPassword: require('./forgotPassword'),

  verifyResetToken: require('./verifyResetToken'),

  resetPassword: require('./resetPassword'),

  getRefreshToken: require('./getRereshToken'),

  updateUser: require('./updateUser'),

  deleteAccount: require('./deleteUser'),
}

module.exports = UserController;
