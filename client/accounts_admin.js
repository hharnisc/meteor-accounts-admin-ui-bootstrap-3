Template.accountsAdmin.helpers({
	users: function() {
		if (!Roles.userIsInRole(Meteor.user(), ['admin']))
			return null;
		return Meteor.users.find({}, {sort: {_id:-1}});
	},

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
	searchFilter: function() {
		return Session.get("userFilter");
	},

	myself: function(userId) {
		return Meteor.userId() === userId;
	}
});

Template.accountsAdmin.events({
	'keyup .search-input': function(event, template) {
		// search no more than 1 time per second
        var setUserFilter = _.throttle(function() {
			var search = template.find(".search-input").value;
			Session.set("userFilter", search);
        }, 1000);
        setUserFilter();
        return false;
    },

    'click .glyphicon-trash': function(event, template) {
		Session.set('userInScope', this);
    },

    'click .glyphicon-info-sign': function(event, template) {
		Session.set('userInScope', this);
    },

    'click .glyphicon-pencil': function(event, template) {
		Session.set('userInScope', this);
    }
});

Template.accountsAdmin.rendered = function() {
	var searchElement = document.getElementsByClassName('search-input');
	if(!searchElement)
		return;
	var filterValue = Session.get("userFilter");

	var pos = 0;
	if (filterValue)
		pos = filterValue.length;

	searchElement[0].focus();
	searchElement[0].setSelectionRange(pos, pos);
};