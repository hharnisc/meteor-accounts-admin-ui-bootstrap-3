Package.describe({
	name: "jamgold:accounts-admin-ui-bootstrap-3",
	summary: "A roles based account management system using bootstrap 3",
	version: "0.2.9",
	git: "https://github.com/hharnisc/meteor-accounts-admin-ui-bootstrap-3.git"
});
//
// api.mainModule("main.js", "client", { lazy: true })
// https://docs.meteor.com/packages/modules.html#Lazy-loading-modules-from-a-package
// Note: Packages with lazy main modules cannot use api.export to export global symbols
//
Package.on_use(function (api, where) {
	api.versionsFrom("METEOR@0.9.0");
  api.use(['ecmascript','blaze-html-templates' ]);
	api.use("alanning:roles@1.2.16", ['client', 'server']);

	api.add_files('libs/user_query.js', ['client', 'server']);

	api.mainModule('index.js', 'client', {lazy:true});

	api.add_files('server/startup.js', 'server');
	api.add_files('server/publish.js', 'server');
	api.add_files('server/methods.js', 'server');
});
