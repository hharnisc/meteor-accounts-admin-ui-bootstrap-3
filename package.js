"use strict";

Package.describe({
	summary: "A roles based account management system using bootstrap 3",
  version: "0.2.9",
  git: "https://github.com/hharnisc/meteor-accounts-admin-ui-bootstrap-3.git",
  name: 'accounts-admin-ui-bootstrap-3'
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@0.9.0");

	api.use('standard-app-packages', ['client', 'server']);
	api.use('twbs:bootstrap', 'client');
	api.use('alanning:roles@1.2.9', ['client', 'server']);
  api.use('iron:router', 'client', { weak: true });
  api.use('mizzao:user-status@0.6.0', 'client', { weak: true });

  api.addFiles('lib/config.js', ['client', 'server']);
  api.addFiles('lib/check.js', ['client', 'server']);
	api.addFiles('lib/user_query.js', ['client', 'server']);
	api.addFiles('client/startup.js', 'client');
	api.addFiles('client/accounts_admin.html', 'client');
	api.addFiles('client/accounts_admin.js', 'client');
	api.addFiles('client/delete_account_modal.html', 'client');
	api.addFiles('client/delete_account_modal.js', 'client');
	api.addFiles('client/info_account_modal.html', 'client');
	api.addFiles('client/info_account_modal.js', 'client');
	api.addFiles('client/update_account_modal.html', 'client');
	api.addFiles('client/update_account_modal.js', 'client');
	api.addFiles('client/update_roles_modal.html', 'client');
	api.addFiles('client/update_roles_modal.js', 'client');
  api.addFiles('client/impersonate_account_modal.html', 'client');
  api.addFiles('client/impersonate_account_modal.js', 'client');

	api.addFiles('style/style.css', 'client');

	api.addFiles('server/startup.js', 'server');
	api.addFiles('server/publish.js', 'server');
	api.addFiles('server/methods.js', 'server');

  api.export("AccountsAdmin");
});
