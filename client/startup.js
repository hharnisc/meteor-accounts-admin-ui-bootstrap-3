Meteor.startup(function() {
	Meteor.subscribe('roles');
	Deps.autorun(function(e) {
		Meteor.subscribe('filteredUsers', Session.get('userFilter'));
	});
});