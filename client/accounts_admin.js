var AdminUsersMaxUsers = 12;

Template.accountsAdmin.onCreated(function(){
	var template = this;
	AccountsAdmin.template = this;
	template.subscription = null;
	template.maxUsers = new ReactiveVar(0);
	template.numPages = new ReactiveVar(0);
	template.skipUsers = new ReactiveVar(0);
	template.adminUsersPage = new ReactiveVar(1);
	template.page = new ReactiveVar(1);
	template.userFilter = new ReactiveVar('');
	template.roleFilter = new ReactiveVar([]);
	var numPages = 0;
	template.subscribe('roles');

	template.disablePaging = function(disable) {
		if(disable)
		{
			template.$('.max-users').attr('disabled', true);
		}
		else
		{
			var page = template.page.get();
			var pages = template.numPages.get();
			template.$('.max-users').attr('disabled', false);
			$('.max-users.backward').attr('disabled', page <= 1);
			$('.max-users.forward').attr('disabled', page >= pages );
		}
	}

	template.autorun(function(){
		var roles = template.roleFilter.get();
		template.skipUsers.set(0);
		template.page.set(1);
	});

	template.autorun(function(){
		var filter = template.userFilter.get();
		var roles = template.roleFilter.get();
		//var userInScope = Session.get('userInScope');
		if(template.subscription) template.subscription.stop();
		if(filter != '')
		{
			// console.log('autorun user filter', filter);
			template.subscription = template.subscribe('filteredUsers', filter,roles);
		}
		else
		{
			var skip = template.skipUsers.get();
			//console.log('autorun user subscribe', filter, skip, AdminUsersMaxUsers);
			template.subscription = template.subscribe('filteredUsers', filter,roles, skip, AdminUsersMaxUsers, function(){
				var user = Meteor.users.findOne({maxUsers:{$exists:1}});
				if(user) {
					var res = user.maxUsers;
					var pages = Math.round(res/AdminUsersMaxUsers);
					pages = pages > 0 ? pages : 1;
					if(pages!=numPages) {
						template.maxUsers.set(res);
						numPages=pages;
						template.numPages.set(pages);
					}
				}
			});
		}
	});

});
Template.accountsAdmin.onDestroyed(function(){
	if(this.subscription) this.subscription.stop();
    AccountsAdmin.template = null;
});
Template.accountsAdmin.helpers({
	users: function() {
		var template = Template.instance();
		var start = template.skipUsers.get();
		var filter = template.userFilter.get();
		var roles = template.roleFilter.get();
		// console.log('users', start, filter);
		return Meteor.users.find({_subscriptionId: template.subscription.subscriptionId},{sort:{'profile.name':1}});
	},
	pages: function() {
		var template = Template.instance();
		var page = template.page.get();
		var pages = template.numPages.get();
		var roles = template.roleFilter.get();
		$('.max-users.backward').attr('disabled', page <= 1);
		$('.max-users.forward').attr('disabled', page >= pages );
		return pages;
	},
	page: function() {
		var template = Template.instance();
		var page = template.page.get();
		var pages = template.numPages.get();
		var roles = template.roleFilter.get();
		$('.max-users.backward').attr('disabled', page <= 1);
		$('.max-users.forward').attr('disabled', page >= pages );
		return page;
	},
	skipUsers: function() {
		var template = Template.instance();
		return template.skipUsers.get();
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
	filteredRoles(){
		return Template.instance().roleFilter.get().length>0 ? 'btn-danger' : 'btn-default';
	},
	searchFilter: function() {
		var template = Template.instance();
		return template.userFilter.get();
	},

	myself: function(userId) {
		return Meteor.userId() === userId;
	},

	contentColumn: function() {
		return Template.instance().contentColumn;
	},

	content: function() {
		var t = Template.instance();
		if(t.content != undefined) return t.content(this);
	},

	displayRoles: function() {
		// console.log(this);
		return this.roles ? this.roles.join(', ') : '';
	},

	instance: function() {
		return Template.instance();
	}
});

// search no more than 2 times per second keyUp
var setUserFilter = _.throttle(function(template) {
	var search = template.find(".search-input-filter").value;
	if(search) template.$('.max-users').attr('disabled', true);
		else template.$('.max-users').attr('disabled', false);
	template.userFilter.set(search);
}, 1000);

Template.accountsAdmin.events({
	'keydown .search-input-filter': function(event, template) {
		// var template = Template.instance();
		// setUserFilter(template);
		if(event.keyCode == 13)
		{
			var search = template.find(".search-input-filter").value;
			template.disablePaging( search != '');
			template.userFilter.set(search);
		}
		// return false;
	},

	'click button.forward': function(event, template) {
		var page = template.page.get();
		page++;
		template.page.set(page);
		template.adminUsersPage.set(page);
		template.skipUsers.set( (page-1) * AdminUsersMaxUsers );
		// console.log('forward',(page-1) * AdminUsersMaxUsers, template.skipUsers.get());
	},

	'click button.backward': function(event, template) {
		var page = template.page.get();
		page--;
		template.page.set(page);
		template.adminUsersPage.set(page);
		template.skipUsers.set( (page-1) * AdminUsersMaxUsers);
		// console.log('backward', (page-1) * AdminUsersMaxUsers, template.skipUsers.get());
	},

	'click .glyphicon-search': function(event, template) {
		var search = template.find(".search-input-filter").value;
		template.disablePaging( search != '');
		template.userFilter.set(search);
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

	// 'change input.start-users': function(event, template) {
	// 	template.skipUsers.set(event.target.value);
	// },

	'click .glyphicon-user, click label.max-users': function(event, template) {
		template.page.set(1);
		template.skipUsers.set(0);
	}
});

Template.accountsAdmin.onRendered(function() {
	var template = this;

	var searchElement = template.find('.search-input-filter');
	if(!searchElement)
		return;
	var filterValue = template.userFilter.get();

	var pos = 0;
	if (filterValue)
		pos = filterValue.length;

	searchElement.focus();
	searchElement.setSelectionRange(pos, pos);
});
