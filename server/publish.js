Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
	// TODO: configurable limit and paginiation
	var queryLimit = 25;

	// if not an admin user don't any other user
	if (!Roles.userIsInRole(this.userId, ['admin']))
		return this.ready();

	if(!!filter) {
		users = Meteor.users.find({
			$or: [
				{'profile.name': {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}}
			]
		}, {sort: {_id: 1}, limit: queryLimit});
	} else {
		users = Meteor.users.find({}, {sort: {_id: 1}, limit: queryLimit});
	}
	return users;
});