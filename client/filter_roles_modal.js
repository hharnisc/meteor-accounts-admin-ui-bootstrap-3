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
			template.data.parent.page.set(1);
		}
	},
});

Template.filterStatusModalInner.onCreated(function(){
	var template = this;
	template.original = template.data.parent.statusFilter.get();
	template.selected = {};
	if(template.original.length>0) {
		template.original.forEach(function(role){
			template.selected[role]=true;
		});
	}
});
Template.filterStatusModalInner.helpers({
	statusConnection: function() {
		var template = Template.instance();
		var statusConnection = [{name:'away'},{name:'offline'},{name:'online'}];
		statusConnection.forEach(function(status){
			if(template.selected[status]) status.checked="checked";else status.checked="";
		})
		return statusConnection;
	},
});
Template.filterStatusModalInner.events({
	'change input.status'(event,template) {
		var checkbox = event.currentTarget;
		if(checkbox.checked) template.selected[checkbox.value]=true;
		else delete template.selected[checkbox.value];
	},
	'click button'(event,template) {
		var selected = Object.keys(template.selected);
		var original = template.original.sort().join(",");
		if(selected.sort().join(",") != original){
			template.original=selected;
			template.data.parent.statusFilter.set(selected);
			template.data.parent.page.set(1);
		}
	},
});