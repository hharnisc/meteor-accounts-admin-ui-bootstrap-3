// Template.addUsersModalInner.helpers({
// 	users: function() {
// 		return users.getAllusers();
// 	},
// 	adminuser: function() {
// 		return this.name === 'admin';
// 	}
// });

Template.addUsersModalInner.events({
	'click .add-user': function(event, template) {
		var username = template.find('.add-user-input-username').value;
		var password1 = template.find('.add-user-input-password-1').value;
		var password2 = template.find('.add-user-input-password-2').value;

		// TODO check that password1 = password2
		Meteor.call('addUser', username, password1, password2, function(error) {
			if (error) {
				console.log( error );
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else
					Errors.throw(error.reason);
			}
			template.find('.add-user-input-username').value = "";
			template.find('.add-user-input-password-1').value = "";
			template.find('.add-user-input-password-2').value = "";
		});
	},

	'keyup .form-control': function(event, template) {
		var buttonElement = template.find('.add-user');
		var username = template.find('.add-user-input-username').value;
		var password1 = template.find('.add-user-input-password-1').value;
		var password2 = template.find('.add-user-input-password-2').value;
		if (!username && !password1 && !password2) {
			buttonElement.classList.add('disabled');
		} else {
			buttonElement.classList.remove('disabled');
		}

		if (event.keyCode === 13 && !!user) {
			Meteor.call('addUser', username, password1, password2, function(error) {
				if (error) {
					// optionally use a meteor errors package
					if (typeof Errors === "undefined")
						Log.error('Error: ' + error.reason);
					else {
						Errors.throw(error.reason);
					}
				}
				template.find('.add-user-input-username').value = "";
				template.find('.add-user-input-password-1').value = "";
				template.find('.add-user-input-password-2').value = "";
				buttonElement.classList.add('disabled');
			});
		}
	}
});