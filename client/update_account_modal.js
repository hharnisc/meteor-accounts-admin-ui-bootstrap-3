Template.updateAccountModalInner.helpers({
	email: function () {
		if (this.emails && this.emails.length)
			return this.emails[0].address;

		if (this.services) {
			//Iterate through services
			for (var serviceName in this.services) {
				var serviceObject = this.services[serviceName];
				//If an 'id' isset then assume valid service
				if (serviceObject.id) {
					if (serviceObject.email) {
						return serviceObject.email;
					}
				}
			}
		}
		return "";
	},

	userInScope: function() {
		return Session.get('userInScope');
	},

	unsetRoles: function() {
		var allRoles = _.pluck(Roles.getAllRoles().fetch(), "name");
		if (!this.roles)
			return allRoles;
		return _.difference(allRoles, this.roles);
	}
});

Template.updateAccountModalInner.events({
	'click .add-role': function(event, template) {
		var role = this.toString();
		var userId = event.currentTarget.getAttribute('data-user-id');
		Meteor.call('addUserRole', userId, role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}

			//update the data in the session variable to update modal templates
			Session.set('userInScope', Meteor.users.findOne(userId));
		});
	},

	'click .remove-role' : function(event, template) {
		var role = this.toString();
		var userId = event.currentTarget.getAttribute('data-user-id');

		Meteor.call('removeUserRole', userId, role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}

			//update the data in the session variable to update modal templates
			Session.set('userInScope', Meteor.users.findOne(userId));
		});
	},

	'change .admin-user-info' : function(event, template) {

		var ele = event.currentTarget;
		var userId = ele.getAttribute('data-user-id');

		Meteor.call('updateUserInfo', userId, ele.name, ele.value, function(error) {
			if (error)
			{
				if (typeof Errors === "undefined") Log.error('Error: ' + error.reason);
				else Errors.throw(error.reason);
				return;
			}
			Session.set('userInScope', Meteor.users.findOne(userId));
		});
	}
});
