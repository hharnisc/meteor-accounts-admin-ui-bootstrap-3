/* global Roles, AccountsAdmin */
"use strict";

var getRoles = function(value) {
  if (_.isArray(value)) {
    return value.join(',');
  } else if (_.isObject(value)) {
    var str = '';
    if (_.isArray(value[Roles.GLOBAL_GROUP])) {
      value[Roles.GLOBAL_GROUP].forEach(function(role) {
        str += role + ',';
      });
    }
    _.keys(value).forEach(function(group) {
      if (group !== Roles.GLOBAL_GROUP) {
        value[group].forEach(function(role) {
          str += role + ' (' + group + '),';
        });
      }
    });
    return str;
  }
};

var getEmail = function(value, user) {

  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services) {
    //Iterate through services
    user.services.forEach(function(serviceName) {
      var serviceObject = user.services[serviceName];
      //If an 'id' isset then assume valid service
      if (serviceObject.id) {
        if (serviceObject.email) {
          return serviceObject.email;
        }
      }
    });
  }
  return "";
};

Template.accountsAdmin.helpers({
  myself: function(userId) {
    return Meteor.userId() === userId;
  },
  fields: function() {
    var fields = [{
      key: '',
      label: '',
      tmpl: Template.accountsAdminControlPanel
    }, {
      key: 'username',
      label: 'username'
    }, {
      key: 'profile.name',
      label: 'Name'
    }, {
      key: 'profile.businessName',
      label: 'Account Name'
    }, {
      key: 'emails.0.address',
      label: 'Email',
      fn: function(value, user) {
        return getEmail(value, user);
      }
    }, {
      key: 'roles',
      label: 'Roles',
      fn: function(value) {
        return getRoles(value);
      }
    }, {
      key: 'createdAt',
      label: 'Created?',
      fn: function(value) {
        return value && value.toDateString();
      }
    }, ];
    if (AccountsAdmin.config.userStatus) {
      fields.push({
        key: 'lastLogin',
        label: 'Last Login',
        fn: function(value) {
          return value && value.toLocaleString();
        }
      });
      fields.push({
        key: 'status.online',
        label: 'Online?'
      });
    }
    return fields;
  },
  users: function() {
    var sortKey = Session.get("accountsAdminSortKey");
    var sort = {};
    sort[sortKey.sort] = sortKey.direction;
    return AccountsAdmin.filteredUserQuery(Meteor.userId(), {
      filter: Session.get("accountsAdminUserFilter"),
      sort: sort
    });
  },
  searchFilter: function() {
    return Session.get("accountsAdminUserFilter");
  },
  maxUsersPerPage: function() {
    return AccountsAdmin.config.maxUsersPerPage;
  }
});

// search no more than 2 times per second
var setUserFilter = _.throttle(function(template) {
  var search = template.find(".search-input-filter").value;
  Session.set("accountsAdminUserFilter", search);
}, 500);

Template.accountsAdmin.events({
  'keyup .search-input-filter': function(event, template) {
    setUserFilter(template);
    return false;
  },
  'click .clickable': function() {
    Session.set('userInScope', this);
  },
  'click .showMore': function(event) {
    event.preventDefault();
    var skip = Session.get("accountsAdminSkip") || 0;
    skip += (AccountsAdmin.config.maxUsersPerPage * +event.target.dataset.direction);
    Session.set("accountsAdminSkip", skip);
  },
});

Template.accountsAdmin.created = function() {
  Session.set("accountsAdminSortKey", {
    key: 'username',
    direction: 1
  });
};


Template.accountsAdmin.rendered = function() {
  var searchElement = document.getElementsByClassName('search-input-filter');
  if (!searchElement)
    return;
  var filterValue = Session.get("accountsAdminUserFilter");

  var pos = 0;
  if (filterValue)
    pos = filterValue.length;

  searchElement[0].focus();
  searchElement[0].setSelectionRange(pos, pos);
};

Template.accountsAdmin.destroyed = function() {
  //clean up the session
  Session.set('userInScope', undefined);
  Session.set('accountsAdminSortKey', undefined);
};

Template.accountsAdminHeader.helpers({
  header: function() {
    return !_.isUndefined(this.label) && this.label || this.key;
  },
  sortDown: function() {
    var sort = Session.get("accountsAdminSortKey");
    return (sort.key === this.key && sort.direction === 1);
  },
  sortUp: function() {
    var sort = Session.get("accountsAdminSortKey");
    return (sort.key === this.key && sort.direction === -1);
  },
});

Template.accountsAdminHeader.events({
  'click .sortIndicator': function(event) {
    event.preventDefault();
    var sort = Session.get("accountsAdminSortKey");
    sort.direction *= -1;
    sort.key = this.key;
    Session.set("accountsAdminSortKey", sort);
  }
});

function index(obj, i) {
  return obj && obj[i];
}
Template.accountsAdminField.helpers({
  field: function() {
    var val = this && this.field.key.split('.').reduce(index, this.user);
    return this.field.fn && this.field.fn(val, this.user) || val;
  },
});

Template.accountsAdminControlPanel.helpers({
  myself: function(userId) {
    return Meteor.userId() === userId;
  },
  allowImpersonate: function() {
    return AccountsAdmin.config.allowImpersonation;
  },
});
