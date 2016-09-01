Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter, skip, limit) {
	var self = this;
	var users = null;
	var userId = this.userId;
	var query = {};
	if (!Roles.userIsInRole(userId, ['admin']))
		return Meteor.users.find(userId);
	// TODO: configurable limit and paginiation
	// var queryLimit = 25;
	var options = {sort: {'profile.name':1}};
	if(skip) options['skip'] = parseInt(skip);
	if(limit) options['limit'] = parseInt(limit);
	// if(Meteor.isServer) console.log(options);
	if(!!filter) {
		// TODO: passing to regex directly could be dangerous
		query = {
			$or: [
				{'profile.name': {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}}
			]
		};
	}
	users = Meteor.users.find(query, options).observeChanges({
		added: function (id, user) {
			user._subscriptionId = self._subscriptionId;
			self.added('users', id, user);
		},
		changed: function (id, fields) {
			self.changed('users', id, fields);
		},
		removed: function (id) {
			self.removed('users', id);
		}
	});
	self.ready();

	self.onStop(function () {
		if(users) users.stop();
	});
});
