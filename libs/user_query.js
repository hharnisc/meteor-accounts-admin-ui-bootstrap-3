filteredUserQuery = function(userId, filter, skip, limit) {
	// if not an admin user don't show any other user
	if (!Roles.userIsInRole(userId, ['admin']))
		return Meteor.users.find(userId);

	// TODO: configurable limit and paginiation
	// var queryLimit = 25;
	var options = {sort: {'profile.name':1}};
	if(skip) options['skip'] = parseInt(skip);
	if(limit) options['limit'] = parseInt(limit);
	// if(Meteor.isServer) console.log(options);
	if(!!filter) {
		// console.log(filter);
		// TODO: passing to regex directly could be dangerous
		users = Meteor.users.find({
			$or: [
				{'profile.name': {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}}
			]
		}, options);
	} else {
		// console.log(options);
		users = Meteor.users.find({}, options);
	}
	return users;
};