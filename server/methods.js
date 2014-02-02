Meteor.methods({
	deleteUser: function(userId) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to delete a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t delete yourself.');
		
		// remove the user
		Meteor.users.remove(userId);
	},

	addUserRole: function(userId, role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account already has the role ' + role);

		// add the user to the role
		Roles.addUsersToRoles(userId, role);
	},

	removeUserRole: function(userId, role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (!Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account does not have the role ' + role);

		Roles.removeUsersFromRoles(userId, role);
	}
});