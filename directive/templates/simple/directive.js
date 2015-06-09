/**
 * @ngdoc directive
 * @name <%= appname %>.directive:<%= _.camelize(name) %>
 * @element element
 * @function
 *
 * @description
 * This directive (<%= _.camelize(name) %>) does something. <-- Edit this.
 *
 * @example
  <example module="<%= appname %>">
    <file name="index.html">
      <element <%= name %>></element>
    </file>
  </example>
 */
angular.module('<%= appname %>').directive('<%= _.camelize(name) %>', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, fn) {


    }
  };
});
