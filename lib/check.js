/* global Roles, AccountsAdmin, MeteorOTP */
"use strict";

AccountsAdmin.checkForAdminAuthentication = function(user) {
  return user && Roles.userIsInRole(user, 'admin') && (!AccountsAdmin.config.otp ||
    MeteorOTP.checkOTP(user) );
};
