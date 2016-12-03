angular.module('starter.controllers', [])

.constant('URL_API', 'http://www.cinea.com.br/WebApi')

.service("AppService", function ($http, URL_API) {
  this.getCities = function () {
      var req = $http.get(URL_API + '/GetCities');
      return req;
  };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HomeCtrl', function($scope, AppService) {
  $scope.ShowMenu = false;

  $scope.ShowOrHideMenu = function(){
    $scope.ShowMenu = !$scope.ShowMenu;
  };

  $scope.Cities = []; 

  var citiesRequest = AppService.getCities();
  citiesRequest.success(function (data) {
      $scope.Cities = data;
  });
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function($scope, $http) {
  $scope.txtsearch = '';

  $scope.doSearch = function(){
    var search = document.getElementById("txt-search").value;

    $http.get('http://localhost:42550/WebApi/TestApi?text=' + search)
    .success(function(data) {
        $scope.Movies = data;
      });
  };

})

.controller('BrowseCtrl', function($scope, $ionicModal, $sce) {  

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.openTraillerPowerRangers = function() {
    $scope.url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/VdnvEicwJvU");
    $scope.modal.show();
  };

  $scope.openTraillerDoctor = function() {
    $scope.url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/YUfWrIcX4zw");
    $scope.modal.show();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

})

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
  // var options = {timeout: 10000, enableHighAccuracy: true};
 
  // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
  //   var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
  //   var mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
 
  //   $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  // }, function(error){
  //   console.log("Could not get location");
  // });
  //  function initialize() {
  //       var myLatlng = new google.maps.LatLng(-21.429943, -45.948568);
        
  //       var mapOptions = {
  //         center: myLatlng,
  //         zoom: 16,
  //         mapTypeId: google.maps.MapTypeId.ROADMAP
  //       };
  //       var map = new google.maps.Map(document.getElementById("map"),
  //           mapOptions);
        
  //       //Marker + infowindow + angularjs compiled ng-click
  //       var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
  //       var compiled = $compile(contentString)($scope);

  //       var infowindow = new google.maps.InfoWindow({
  //         content: compiled[0]
  //       });

  //       var marker = new google.maps.Marker({
  //         position: myLatlng,
  //         map: map,
  //         title: 'Uluru (Ayers Rock)'
  //       });

  //       google.maps.event.addListener(marker, 'click', function() {
  //         infowindow.open(map,marker);
  //       });

  //       $scope.map = map;
  //     }
  //     google.maps.event.addDomListener(window, 'load', initialize);
      
  //     $scope.centerOnMe = function() {
  //       if(!$scope.map) {
  //         return;
  //       }

  //       $scope.loading = $ionicLoading.show({
  //         content: 'Getting current location...',
  //         showBackdrop: false
  //       });

  //       navigator.geolocation.getCurrentPosition(function(pos) {
  //         $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  //         $scope.loading.hide();
  //       }, function(error) {
  //         alert('Unable to get location: ' + error.message);
  //       });
  //     };
      
  //     $scope.clickTest = function() {
  //       alert('Example of infowindow with ng-click')
  //     };
});
