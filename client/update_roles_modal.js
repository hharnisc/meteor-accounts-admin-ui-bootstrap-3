Template.updateRolesModalInner.helpers({
	roles: function() {
		return Roles.getAllRoles();
	},
	adminRole: function() {
		return this.name === 'admin';
	}
});

Template.updateRolesModalInner.events({
	'click .add-role': function(event, template) {
		var role = template.find('.add-role-input').value;
		Meteor.call('addRole', role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			template.find('.add-role-input').value = "";
		});
	},

	'click .remove-role' : function(event, template) {
		var role = this.name;

		Meteor.call('removeRole', role, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
		});
	},

	'keyup .add-role-input': function(event, template) {
		var buttonElement = template.find('.add-role');
		var role = template.find('.add-role-input').value;
		if (!role) {
			buttonElement.classList.add('disabled');
		} else {
			buttonElement.classList.remove('disabled');
		}

		if (event.keyCode === 13 && !!role) {
			Meteor.call('addRole', role, function(error) {
				if (error) {
					// optionally use a meteor errors package
					if (typeof Errors === "undefined")
						Log.error('Error: ' + error.reason);
					else {
						Errors.throw(error.reason);
					}
				}
				template.find('.add-role-input').value = "";
				buttonElement.classList.add('disabled');
			});
		}
	}
});