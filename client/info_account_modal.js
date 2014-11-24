Template.infoAccountModalInner.helpers({
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

  roles: function() {
    var self = this;
    var roles = [];
    if (_.isArray(self.roles)) {
      roles = self.roles;
    } else if (_.isObject(self.roles)) {
      if (_.isArray(self.roles[Roles.GLOBAL_GROUP])) {
        self.roles[Roles.GLOBAL_GROUP].forEach(function(role) {
          roles.push(role);
        });
      }
      _.keys(self.roles).forEach(function(group) {
        if (group !== Roles.GLOBAL_GROUP) {
          self.roles[group].forEach(function(role) {
            roles.push(role + ' (' + group + ')');
          });
        }
      });
    }
    return roles;
  }
});
