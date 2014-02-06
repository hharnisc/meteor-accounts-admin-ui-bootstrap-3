Template.accountsAdmin.helpers({
	users: function() {
		return filteredUserQuery(Meteor.userId(), Session.get("userFilter"));
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

// search no more than 2 times per second
var setUserFilter = _.throttle(function(template) {
	var search = template.find(".search-input-filter").value;
	Session.set("userFilter", search);
}, 500);

Template.accountsAdmin.events({
	'keyup .search-input-filter': function(event, template) {
        setUserFilter(template);
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
	var searchElement = document.getElementsByClassName('search-input-filter');
	if(!searchElement)
		return;
	var filterValue = Session.get("userFilter");

	var pos = 0;
	if (filterValue)
		pos = filterValue.length;

	searchElement[0].focus();
	searchElement[0].setSelectionRange(pos, pos);
};