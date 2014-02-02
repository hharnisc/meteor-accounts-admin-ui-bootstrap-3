Meteor.startup(function() {
	// might need to use a session variable here
	Deps.autorun(function(e) {
		Meteor.subscribe('roles');
		Meteor.subscribe('filteredUsers', Session.get('userFilter'));
	});
});