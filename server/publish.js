Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
	return filteredUserQuery(this.userId, filter);
});