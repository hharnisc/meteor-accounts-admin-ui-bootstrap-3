Template.impersonateAccountModalInner.helpers({
  userInScope: function () {
    return Session.get('userInScope');
  },
});


Template.impersonateAccountModalInner.events({
  'click .btn-danger': function (event, template) {
    var self = this;
    Meteor.call('impersonateUser', self._id, function (error) {
      if (error) {
        // optionally use a meteor errors package
        if (typeof Errors === "undefined")
          Log.error('Error: ' + error.reason);
        else {
          Errors.
          throw (error.reason);
        }
      }
      // $("#impersonateaccount").modal("hide");
      // event.stopImmediatePropagation();
      // event.preventDefault();
      Meteor.connection.setUserId(self._id);
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      Router.go("plansList");
    });
  }
});
