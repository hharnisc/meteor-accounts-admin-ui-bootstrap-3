

Meteor.startup(function() {
	if (!accountsAdminUiConfiguration || !accountsAdminUiConfiguration.manualSubscriptions) {
		Meteor.subscribe('roles');
		Deps.autorun(function() {
			Meteor.subscribe('filteredUsers', Session.get('userFilter'));
		});
	}
});