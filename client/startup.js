/* global AccountsAdmin */
"use strict";

AccountsAdmin.subscribe = function() {
  return [Meteor.subscribe('roles'),
  Meteor.subscribe('filteredUsers', {
    filter: Session.get('accountsAdminUserFilter') || '',
    skip: Session.get("accountsAdminSkip") || null,
    sort: Session.get("accountsAdminSortKey") || null,
  })];
};


Meteor.startup(function() {
  if (!AccountsAdmin.config.manualSubscriptions) {
    Tracker.autorun(function() {
      AccountsAdmin.subscribe();
    });
  }
});
