angular.module('wireframe')
.controller('pageEditorCtrl', [
  '$scope',
  '$modalInstance',
  'page',
function($scope, $modalInstance, page){

  $scope.page = page || {
    name: '',
    imgSrc: ''
  };
  
  $scope.onComplete = function(){
    $modalInstance.close($scope.page);
  };

  $scope.onCancel = function(){
    $modalInstance.dismiss('cancel');
  };

}]);