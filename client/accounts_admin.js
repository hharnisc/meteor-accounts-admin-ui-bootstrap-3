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
	},

  allowImpersonate: function() {
    return (typeof accountsAdminUiConfiguration !== 'undefined' && accountsAdminUiConfiguration.allowImpersonation);
  },

  userStatus: function() {
    return (typeof accountsAdminUiConfiguration !== 'undefined' && accountsAdminUiConfiguration.userStatus);
  },
  lastLogin: function() {
    if (this.status && this.status.lastLogin) {
      var date = (typeof this.status.lastLogin === "object" && this.status.lastLogin.date) ?
        this.status.lastLogin.date : this.status.lastLogin;
      return date.toLocaleString();
    }
    return '';
  },
  createdAt: function() {
    return (this.createdAt) ? this.createdAt.toDateString() : '';
  },

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
    },

    'click .glyphicon-eye-open': function(event, template) {
      Session.set('userInScope', this);
    }
});

Template.accountsAdmin.created = function() {
  Session.set("sortKey", "email");
};


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

Template.accountsAdmin.destroyed = function() {
  //clean up the session
  Session.set('userInScope', undefined);
  Session.set('sortKey', undefined);
}
