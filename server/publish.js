Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter, roles, online, skip, limit) {
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
	if(roles != undefined && roles.length>0) {
		query['roles']={$all: roles};
	}
	if(online != undefined && online.length>0) {
		// konecty:user-presence
		// query['status']={$in:online};
		let q = {
			// _id: {
			//   $ne: this.connection.sessionKey // don't publish the current user
			// },
			status: 'online', // publish only clients that called 'setPresence'
			userId: {$exists: 1},
		};
		let ids = [...new Set(presences.find(q).map((u)=>{return u.userId}))];
		// let ids = presences.find(q,{fields:{status:1,userId:1}}).map((u)=>{return u.userId});
		query['_id'] = {$in: ids}
	}
	// console.log('filteredUsers', query,options);
	var maxUsers = Meteor.users.find(query).count();
	users = Meteor.users.find(query, options).observeChanges({
		added: function (id, user) {
			// user._subscriptionId = self._subscriptionId;
			user.maxUsers = maxUsers;
			self.added('users', id, user);
		},
		changed: function (id, fields) {
			// fields._subscriptionId = self._subscriptionId;
			fields.maxUsers = maxUsers;
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
