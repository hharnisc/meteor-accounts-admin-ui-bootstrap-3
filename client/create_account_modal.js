Template.createAccountModalInner.helpers({
	roles: function() {
		return Session.get('selectedRoles');
	},

	unsetRoles: function() {
		var allRoles = _.pluck(Roles.getAllRoles().fetch(), "name");

		if (!this.roles) {
			return allRoles;
		}

		return _.difference(allRoles, this.roles);
	}
});

Template.createAccountModalInner.events({
	'click .add-role': function(event, template) {
		var role = this.toString();
		var roles = Session.get('selectedRoles') || [];

		roles.push(role);
		Session.set('selectedRoles', roles);
	},

	'click .remove-role' : function(event, template) {
		var role = this.toString();
		var roles = Session.get('selectedRoles') || [];

		roles = _.without(roles, role);
		Session.set('selectedRoles', roles);
	},

	'click .btn-primary' : function(event, template) {
		event.preventDefault();

		var data = {
			email: $.trim($('[name=email]').val()),
			username: $.trim($('[name=username]').val()),
			password: $.trim($('[name=password]').val()),
			profile: {
				name: $.trim($('[name="profile-name"]').val())
			},
			roles: Session.get('selectedRoles') || []
		};

		Meteor.call('createUserAccount', data, function (error, user) {
			if (error) {
				if (typeof Errors === "undefined") {
					Log.error('Error: ' + error.reason);
				} else {
					Errors.throw(error.reason);
				}
				return;
			}

			Session.set('selectedRoles', []);
			$('.btn-danger').trigger('click');
		});
	}
});
