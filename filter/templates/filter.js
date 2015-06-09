/**
 * @ngdoc filter
 * @name <%= appname %>.filter:<%= _.camelize(name) %>
 * @function
 *
 * @description
 * # <%= _.camelize(name) %>
 * Filter in the <%= appname %> app.
 */
angular.module('<%= appname %>').filter('<%= _.camelize(name) %>', function () {
  return function (input, arg) {
    return 'output';
  };
});
