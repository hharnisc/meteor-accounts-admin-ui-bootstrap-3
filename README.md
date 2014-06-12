# Accounts Admin UI (Bootstrap 3)

A roles based account management system using bootstrap 3 for Meteor.

**Table of Contents**

- [TODO](#todo)
- [History](#history)
- [Quick Start](#quick-start)
- [Iron Router Integration](#iron-router-integration)
- [Contributing](#contributing)

## TODO

- ~~Implement UI to create/remove roles (currently done at Meteor.startup)~~ DONE
- Configurable fields
- Implement pagination (currently relies on search to find users)
- Write tests
- User impersonation (for admins)

## History
**Latest Version:** 0.2.6
- Remove hard dependency to bootstrap-3 (so less-bootstrap-3 or similar can be used). (Thanks to [@johnm](https://github.com/johnm))
- Documentation updates
- Fixes [Issue #18](https://github.com/hharnisc/meteor-accounts-admin-ui-bootstrap-3/issues/18)

**Version:** 0.2.5

- Bump roles version; v1.2.8 is Blaze-compatible (thanks to [@alanning](https://github.com/alanning)!)

**Version:** 0.2.4

- Support [changes made in Meteor 0.8.0-rc0](https://github.com/meteor/meteor/issues/1930)
- Fixes [Issue #7](https://github.com/hharnisc/meteor-accounts-admin-ui-bootstrap-3/issues/7)
- Update to bootstrap-3.1.1

**Version:** 0.2.3

- Now supports changing usernames from admin interface (thanks to [@djkmiles](https://github.com/djkmiles)!)

**Version:** 0.2.2

- Fixed bugs due to fallout from removing bootstrap-modal

**Version:** 0.2.1

- Removed dependency to bootstrap-modal

**Version:** 0.2.0

- Added UI to create/remove roles

**Version:** 0.1.0

- Created a basic UI to find users, delete users, and modify roles.

## Quick Start

Set up a simple admin page

```sh
$ mrt create app
$ cd app
$ mrt add bootstrap-3		# or mrt add less-bootstrap-3
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

		// create a couple of roles if they don't already exist (THESE ARE NOT NEEDED -- just for the demo)
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
            {{> loginButtons }}
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

At this point you should see the UI.  Signout and add a few more users so you can play with the roles. You can add and 
remove roles all through the UI.

## Iron Router Integration

This tool plays nice with Iron Router package, add to following configuration to your router.
Or take a look at this [working example](https://github.com/hharnisc/meteor-accounts-admin-ui-bootstrap-3-demo).

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
		onBeforeAction: function() {
			if (Meteor.loggingIn()) {
                this.render(this.loadingTemplate);
            } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
                console.log('redirecting');
                this.redirect('/');
            }
		}
	});
});
```

## Contributing

If you've got a change you think would benefit the community send me a pull request.

**Contributors**
- [@djkmiles](https://github.com/djkmiles)
- [@alanning](https://github.com/alanning)
- [@johnm](https://github.com/johnm)