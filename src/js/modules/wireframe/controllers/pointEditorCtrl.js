angular.module('wireframe')
.controller('pointEditorCtrl', [
  '$scope',
  '$modalInstance',
  'point',
function($scope, $modalInstance, point){

  $scope.point = point || { content: '' };
  
  $scope.onComplete = function(){
    $modalInstance.close($scope.point);
  };

  $scope.onCancel = function(){
    $modalInstance.dismiss('cancel');
  };

}]);