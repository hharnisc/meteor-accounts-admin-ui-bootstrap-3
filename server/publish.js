Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter, start, limit) {
	return filteredUserQuery(this.userId, filter, start, limit);
});