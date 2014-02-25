angular.module('wireframe')
.directive('mapPoint', [function(wireframeService){
  return {
    restrict: 'E',
    scope: {
      point: "="
    },
    template: '<svg class="mapPoint" ng-attr-x="{{point.loc[0]}}" ng-attr-y="{{point.loc[1]}}" viewbox="0 50 100 50" cursor="pointer">'+
        '<path d="M0,56 C0,-10 100,-10 100,56 C100,64 100,90 50,150 C0,90 0,64 0,56" ng-attr-fill="{{point.color}}" />'+
        '<circle cx="50" cy="56" r="45" fill="white" />'+
        '<text style="font-family:Arial; font-size:72px; font-weight:bold;" fill="black" x="30" y="80">{{point.id}}</text>'+
      '</svg>',
    replace: true,
    link: function($scope, $el, $attrs){

      var drag = d3.behavior.drag()
      .origin(function() {
        var t = d3.select(this);
        return {
          x: t.attr("x"),
          y: t.attr("y")
        };
      })
      .on('drag', function(d){
        // update the data
        d.point.loc[0] = d3.event.x;
        d.point.loc[1] = d3.event.y;
        // move the element
        // d3.select(this).attr("transform", "translate(" + [d3.event.x, d3.event.y] + ")");
        $scope.$apply();
      });

      // apply drag to pin
      d3.select($el[0]).data([{point:$scope.point}]).call(drag);
    }
  };
}]);