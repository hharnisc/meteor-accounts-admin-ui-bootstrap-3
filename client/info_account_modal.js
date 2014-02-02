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

	rolePairs: function() {
		var pairs = [];
		if (!this.roles)
			pairs.push({key: 'Roles', value: 'None'});

		for (var role in this.roles) {
			var r = this.roles[role];
			if (role === '0') {
				pairs.push({key: 'Roles', value: r});
			} else {
				pairs.push({key: '-', value: r});
			}
		}
		return pairs;
	}
});
