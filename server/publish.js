Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
  check(filter, Match.OneOf(String, RegExp, null));
	return filteredUserQuery(this.userId, filter);
});
