/* global  AccountsAdmin, Roles */
"use strict";

//Userid - current user
//Options:
//  filter - alphanumeric string to search users name and email for
//  skip - skip the first n values
//  sort - return the users in the order specified by this sort object
AccountsAdmin.filteredUserQuery = function(userId, options) {

  // if not an admin user don't show any other user
  if (!Roles.userIsInRole(userId, ['admin'])) {
    return Meteor.users.find(userId);
  }

  var queryOptions = {};

  if (Meteor.isServer) { //skip and limit force reactive-table to use addedBefore instead of added on the observer
    //since these are really for server paging, no need to do them on the client
    queryOptions.limit = AccountsAdmin.config.maxUsersPerPage;
    if (options.skip && !options.filter) {
      queryOptions.skip = options.skip;
    }
  }

  if (options.sort) {
    queryOptions.sort = {};
    queryOptions.sort[options.sort.key] = options.sort.direction;
  }

  var query = {};
  if (options.filter) {
    var filter = options.filter.replace(/[^\w]/g, '.'); //my take on santizing the filter
    query = {
      $or: [{
        'profile.name': {
          $regex: filter,
          $options: 'i'
        }
      }, {
        'emails.address': {
          $regex: filter,
          $options: 'i'
        }
      }]
    };
  }
  return Meteor.users.find(query, queryOptions);
};
