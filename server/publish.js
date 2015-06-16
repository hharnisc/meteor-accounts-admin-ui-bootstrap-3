Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
	if (filter === null) {
		check(filter, null);
	} else {
		check(filter, String);
	}

	return filteredUserQuery(this.userId, filter);
});
