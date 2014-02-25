angular.module('wireframe')
.directive('screenshot', [function(){
  return {
    restrict: 'E',
    scope: {
      imgSrc: "=",
      points: "="
    },
    template: '<svg xmlns="http://www.w3.org/TR/SVG/" xlink:xmlns="http://www.w3.org/TR/xlink/" width="100%" height="70%" viewbox="0 0 2800 1800" preserveAspectRatio="true">'+
      '<image x="0" y="0" width="100%" height="100%" xlink:href="blank.png" ng-xlink-href="images/{{imgSrc}}" />'+
      '<map-point ng-repeat="point in points" point="point" viewbox="0 0 300 200" />'+
    '</div>',
    replace: true
  };
}]);