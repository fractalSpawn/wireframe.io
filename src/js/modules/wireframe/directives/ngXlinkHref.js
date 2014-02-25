angular.module('wireframe')
.directive('ngXlinkHref', [function(){
  return {
    priority: 99,
    link: function (scope, element, attrs) {
      attrs.$observe('ngXlinkHref', function (value) {
        if (!value) return;
        attrs.$set("xlink:href", value);
      });
    }
  };
}]);