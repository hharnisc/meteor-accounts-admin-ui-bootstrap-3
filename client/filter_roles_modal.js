Template.filterRolesModalInner.onCreated(function(){
	var template = this;
	template.original = template.data.parent.roleFilter.get();
	template.selected = {};
	if(template.original.length>0) {
		template.original.forEach(function(role){
			template.selected[role]=true;
		});
	}
});
Template.filterRolesModalInner.helpers({
	roles: function() {
		var template = Template.instance();
		var roles = Meteor.roles.find({},{sort:{name:1}}).fetch();//Roles.getAllRoles();
		roles.forEach(function(role){
			if(template.selected[role.name]) role.checked="checked";else role.checked="";
		})
		return roles;
	},
	adminRole: function() {
		return this.name === 'admin';
	}
});

Template.filterRolesModalInner.events({
	'change input.role'(event,template) {
		var checkbox = event.currentTarget;
		if(checkbox.checked) template.selected[checkbox.value]=true;
		else delete template.selected[checkbox.value];
	},
	'click button'(event,template) {
		var selected = Object.keys(template.selected);
		var original = template.original.sort().join(",");
		if(selected.sort().join(",") != original){
			template.original=selected;
			template.data.parent.roleFilter.set(selected);
		}
	},
});