/**
 * @ngdoc service
 * @name <%= appname %>.<%= _.camelize(name) %>
 *
 * @description
 * # <%= _.camelize(name) %>
 * Service in the <%= appname %> app.
 */
angular.module('<%= appname %>').factory('<%= _.camelize(name) %>', function() {

  var <%= _.camelize(name) %> = {};

  return <%= _.camelize(name) %>;

});
