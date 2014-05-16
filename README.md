# Accounts Admin UI (Bootstrap 3)

A roles based account management system using bootstrap 3 for Meteor.

**Table of Contents**

- [TODO](#todo)
- [History](#history)
- [Quick Start](#quick-start)
- [Iron Router Integration](#iron-router-integration)
- [Configuration & Optional Features](#configuration)
- [Contributing](#contributing)

## TODO

- ~~Implement UI to create/remove roles (currently done at Meteor.startup)~~ DONE
- Configurable fields
- Implement pagination (currently relies on search to find users)
- Write tests

## History

**Latest Version:** 0.2.5

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
## Configuration & Optional Features

**Configuration**
You can optionally configure this beyond the defaults by creating a accountsAdminUiConfiguration object anywhere in
the server/client shared part of your source code.

To change the number of users shown in the main accounts screen:

```javascript
accountsAdminUiConfiguration = {
  maxUsersPerPage: 25, //max users to show in accounts_admin screen
};
```

**Impersonation**
Impersonation allows administrators to become a user without having login credentials for that user.  It's very
handy for debugging user problems as ad administrator can experience you application as a user does.  Iron Router is
required for it to automatically change to a different route on successful impersonation.  To enable it you
need this minimum configuration:

```javascript
accountsAdminUiConfiguration = {
  allowImpersonation: true, //true or the feature isn't enabled
  impersonationRoles: ['admin'], //only this role(s) may use this impersonation feature
  impersonationSuccessRoute: 'plansList', //once you have successfully impersonated a user, it will Router.go(impersonationSuccessRoute)
};
```

You will also want to put your impersonationSuccessRoute subscriptions in an Deps.autorun so that they change when the user changes.
Something like (though you need to change this for whatever makes sense for your routing configuration):
```javascript
this.route('plansList', {
  onBeforeAction: function () {
    var self = this;
    Deps.autorun(function () {
      var user = Meteor.user();
      if (user) {
        logger.debug("Subscribe for business and plans to user: " + user._id);
        self.subscribe('plans').wait();
      }
    });
  },
});
```
NOTE - This is an adminsitrative feature that allows a privileged user access beyond it's normal user.  Use with caution.

Code inspired by: https://dweldon.silvrback.com/impersonating-a-user


**Last login support**
This feature requires the user-status (mrt add user-status) package.  It shows the last login time for each user along with
a boolean indicating if they are logged in now.  Enable with this configuration:

```javascript
accountsAdminUiConfiguration = {
  userStatus: true, //if true and user-status pacakge installed, this will show last login and current login status
};
```






## Contributing

If you've got a change you think would benefit the community send me a pull request.

**Contributors**
- [@djkmiles](https://github.com/djkmiles)
- [@alanning](https://github.com/alanning)
