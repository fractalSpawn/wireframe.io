angular.module('wireframe')
.controller('wireframeCtrl', [
  '$scope',
  '$modal',
  'tinyColor',
function($scope, $modal, tinyColor){
  
  $scope.color = tinyColor('0AF');

  $scope.wireframe = {
    projectName: "Mandelbulber",
    pages: [{
      name: "Main Interface",
      points: [{
        "id": "1",
        "content": "The preview panel shows a rendering of the current fractal with the current view settings.",
        "loc": [50, 120],
        "color": "#F00"
      },{
        "id": "2",
        "content": "The settings panel is where the user is able to adjust the settings of the fractal and the view. Colors, shading and rendering effects like depth of field can also be set.",
        "loc": [1500, 10],
        "color": "#F00"
      },{
        "id": "3",
        "content": "The histogram panel shows information about the settings and the render. It can be used as a guide to make the algorithm or settings more efficient.",
        "loc": [300, 1200],
        "color": "#F00"
      }],
      imgSrc: "Screen Shot 2014-02-21 at 10.28.47 PM.png"
    },{
      name: "Render Panel",
      points: [{
        "id": "1",
        "content": "The render panel can be configured to show the render at various sizes. There are 4 zoom out levels and 4 zoom in levels with 'Fit to window' selected by default.",
        "loc": [150, 860],
        "color": "#F00"
      },{
        "id": "2",
        "content": "The render panel can also be configured to do different actions when the user clicks the image. Move the camera is selected by default.",
        "loc": [650, 860],
        "color": "#F00"
      }],
      imgSrc: "Screen Shot 2014-02-21 at 10.28.47 PM.png"
    }]
  };

  $scope.currentPageNum = 1;
  $scope.currentPage = $scope.wireframe.pages[0];

  $scope.setCurrentPage = function(page){
    $scope.currentPageNum = page;
    $scope.currentPage = $scope.wireframe.pages[$scope.currentPageNum - 1];
  };

  $scope.addPage = function(newPage){
    $scope.wireframe.pages.push(newPage);
    $scope.setCurrentPage($scope.wireframe.pages.length);
  };

  $scope.removePage = function(page){
    angular.forEach($scope.wireframe.pages, function(p,i){
      if(p === page){
        $scope.wireframe.pages.splice(i,1);
      }
    });
  };

  $scope.addPoint = function(newPoint){
    // new points don't have IDs. Checking for an id
    // makes sure we don't add points when we edit.
    if(!newPoint.id){
      newPoint.id = $scope.currentPage.points.length+1;
      newPoint.loc = [0,0];
      $scope.currentPage.points.push(newPoint);  
    }
  };

  $scope.removePoint = function(point){
    angular.forEach($scope.currentPage.points, function(p,i){
      if(p === point){
        $scope.currentPage.points.splice(i,1);
      }
    });
  };

  $scope.launchPageEditor = function(page){
    var modalInstance = $modal.open({
      templateUrl: 'src/js/modules/wireframe/partials/pageEditor.html',
      controller: 'pageEditorCtrl',
      resolve: {
        page: function(){ return page; }
      }
    });

    modalInstance.result.then(function(newPage){
      $scope.addPage(newPage);
    });
  };

  $scope.launchPointEditor = function(point){
    var modalInstance = $modal.open({
      templateUrl: 'src/js/modules/wireframe/partials/pointEditor.html',
      controller: 'pointEditorCtrl',
      resolve: {
        point: function(){ return point; }
      }
    });

    modalInstance.result.then(function(newPoint){
      $scope.addPoint(newPoint);
    });
  };

}]);