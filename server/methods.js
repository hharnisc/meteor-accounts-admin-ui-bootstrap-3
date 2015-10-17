/* global Roles, AccountsAdmin */
"use strict";


Meteor.methods({
	deleteUser: function(userId) {
    check(userId, String);
		var user = Meteor.user();
		if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		if (user._id === userId)
			throw new Meteor.Error(422, 'You can\'t delete yourself.');

		// remove the user
		Meteor.users.remove(userId);
	},

	addUserRole: function(userId, role, group) {
    check(userId, String);
    check(role, String);
    check(group, Match.Optional(String));
		var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (Roles.userIsInRole(userId, role, group))
			throw new Meteor.Error(422, 'Account already has the role ' + role);

		// add the user to the role
		Roles.addUsersToRoles(userId, role, group);
	},

	removeUserRole: function(userId, role, group) {
    check(userId, String);
    check(role, String);
    check(group, Match.Optional(String));
		var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (!Roles.userIsInRole(userId, role, group))
			throw new Meteor.Error(422, 'Account does not have the role ' + role);

		Roles.removeUsersFromRoles(userId, role, group);
	},

	addRole: function(role) {
    check(role, String);
		var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		// handle existing role
		if (Meteor.roles.find({name: role}).count() > 0 )
			throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

		Roles.createRole(role);
	},

	removeRole: function(role) {
    check(role, String);
		var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		// handle non-existing role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		if (role === 'admin')
			throw new Meteor.Error(422, 'Cannot delete role admin');

		// remove the role from all users who currently have the role
		// if successfull remove the role
		Meteor.users.update(
			{roles: role },
			{$pull: {roles: role }},
			{multi: true},
			function(error) {
				if (error) {
					throw new Meteor.Error(422, error);
				} else {
					Roles.deleteRole(role);
				}
			}
		);
	},

	updateUserProfile: function(id, property, value) {
    check(id, String);
    check(property, String);
    //Giving the value a range of possible safe values
    check(value, Match.OneOf(String, Number, Boolean, Date, undefined, null));
		var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

		if (property !== 'name')
			throw new Meteor.Error(422, "Only 'name' is supported.");

		var obj = {};
		obj['profile.' + property] = value;
		Meteor.users.update({_id: id}, {$set: obj});

	},

  //Inspired by: https://dweldon.silvrback.com/impersonating-a-user
  impersonateUser: function(targetUserId) {
    check(targetUserId, String);

    var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

    if (! Meteor.users.findOne(targetUserId))
      throw new Meteor.Error(422, "Unable to find targetUserId to impersonate: " + targetUserId);


    if (AccountsAdmin.config.allowImpersonation) {
      this.setUserId(targetUserId);
    }
    else
      throw new Meteor.Error(422, "Enable AccountsAdmin.config.allowImpersonation key to allow impersonation");

  },
  setPassword: function(targetUserId, newPassword) {
    check(targetUserId, String);
    check(newPassword, String);

    //this password should be hashed, but it's in plaintext right now
    var user = Meteor.user();
    if (!user || ! AccountsAdmin.checkForAdminAuthentication(user))
      throw new Meteor.Error(401, "You need to be an authenticated admin");

    if (! Meteor.users.findOne(targetUserId))
      throw new Meteor.Error(422, "Unable to find targetUserId to set password on: " + targetUserId);

    Accounts.setPassword(targetUserId, newPassword);
  }

});
