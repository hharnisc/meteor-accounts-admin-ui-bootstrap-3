# Accounts Admin UI (Bootstrap 3)

A roles based account management system using bootstrap 3 for Meteor.

**Table of Contents**

- [TODO](#todo)
- [History](#history)
- [Quick Start](#quick-start)
- [Iron Router Integration](#iron-router-integration)

## TODO

- Implement UI to create/remove roles (currently done at Meteor.startup)
- Implement pagination (currently relies on search to find users)
- Write tests

## History

**Latest Version:** 0.1.0

Created a basic UI to find users, delete users, and modify roles.

## Quick Start

Set up a simple admin page

```sh
$ mrt create app
$ cd app
$ mrt add accounts-password
$ mrt add roles
$ mrt add accounts-ui-bootstrap-3
$ mrt add accounts-admin-ui-bootstrap-3
$ mrt remove autopublish
$ mrt remove insecure
```

**app.js**
```javascript
if (Meteor.isServer) {
	Meteor.startup(function () {
		// bootstrap the admin user if they exist -- You'll be replacing the id later
		if (Meteor.users.findOne("your_admin_user_id"))
			Roles.addUsersToRoles("your_admin_user_id", ['admin']);

		// create a couple of roles if they don't already exist
		if(!Meteor.roles.findOne({name: "secret"}))
            Roles.createRole("secret");

        if(!Meteor.roles.findOne({name: "double-secret"}))
            Roles.createRole("double-secret");
	});
}

if (Meteor.isClient) {
	Template.adminTemplate.helpers({
		// check if user is an admin
		isAdminUser: function() {
			return Roles.userIsInRole(Meteor.user(), ['admin']);
		}
	})
}
```

**app.html**
```html
<head>
  <title>Accounts Admin</title>
</head>

<body>
	<div class="navbar navbar-default" role="navigation">
        <div class="navbar-header">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">Accounts Admin</a>
            </div>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">  
            </ul>
            <ul class="nav navbar-nav navbar-right">
            {{ loginButtons }}
            </ul>
        </div>
    </div>
    <div class="container">
		{{> adminTemplate}}
	</div>
</body>

<template name="adminTemplate">
	{{#if isAdminUser}}
		{{> accountsAdmin}}
	{{else}}
		Must be admin to see this...
	{{/if}}
</template>
```

After you edit app.js and app.html you need to create a new user and then set the 'admin' role to that user.

1. Go to [http://localhost:3000](http://localhost:3000) and click on the "Sign In / Up" and create your user there.
2. In the browser console grab the user id from the user you just created Meteor.userId()
3. Copy the user id and paste it into to "your_admin_user_id" in app.js created above.
4. Restart meteor 

At this point you should see the UI.  Signout and add a few more users so you can play with the roles.  (You can't edit your own roles or delete yourself)

## Iron Router Integration

This tool plays nice with Iron Router package, add to following configuration to your router.

**router.js**
```javascript
Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'home'
	});

	this.route('admin', {
		path:'/admin',
		template: 'accountsAdmin',
		before: function() {
			if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
				Log('Redirecting');
				this.redirect('/');
			}
		}
	});
});
```