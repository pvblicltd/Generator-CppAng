/**
 * @ngdoc directive
 * @name <%= appname %>.directive:<%= _.camelize(name) %>
 * @function
 *
 * @description
 * This directive (<%= _.camelize(name) %>) does something. <-- Edit this.
 *
 * @example
  <example module="<%= appname %>">
    <file name="index.html">
      <<%= name %>></<%= name %>>
    </file>
  </example>
 */
angular.module('<%= appname %>').directive('<%= _.camelize(name) %>', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: '<%= htmlPath %>',
    link: function (scope, element, attrs, fn) {
      element.text('this is the <%= _.camelize(name) %> directive');
    }
  };
});
