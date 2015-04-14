/* global AccountsAdmin, Roles, MeteorOTP */
"use strict";

Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});


var positiveInteger = Match.Where(function(x) {
  check(x, Match.Integer);
  return x >= 0;
});

// var plainString = Match.Where(function(x) {
//   check(x, String);
//   return !!x.match(/^\w*$/);
// });

var checkForAdminAndOTP = function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  return user && Roles.userIsInRole(user, 'admin') && MeteorOTP.checkOTP(user);
};

Meteor.publish('filteredUsers', function(options) {
  var self = this;
  check(options, Match.ObjectIncluding({
    filter: String,
    skip: Match.OneOf(positiveInteger, undefined, null),
    sort: Match.OneOf(Object, undefined, null)
    // sort: Match.OneOf(Match.ObjectIncluding({ direction: Match.OneOf(1, -1), key: String }), null, undefined)
  }));

  if (!checkForAdminAndOTP(self.userId)) {
    return;
  }

  return AccountsAdmin.filteredUserQuery(self.userId, options);
});
