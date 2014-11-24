/* global AccountsAdmin */
"use strict";

Template.impersonateAccountModalInner.helpers({
  userInScope: function() {
    return Session.get('userInScope');
  },
});


Template.impersonateAccountModalInner.events({
  'click .btn-danger': function() {
    var self = this;
    Meteor.call('impersonateUser', self._id, function(error) {
      if (error) {
        console.error("Render impersonate got error: ", error);
      } else {
        Meteor.connection.setUserId(self._id);
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        if (AccountsAdmin.config.impersonationSuccess) {
          AccountsAdmin.config.impersonationSuccess();
        }
      }
    });
  }
});
