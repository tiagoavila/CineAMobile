angular.module('starter.controllers', [])

.constant('URL_API', 'http://testecinea.azurewebsites.net/webapi')
// .constant('URL_API', 'http://localhost:42550/webapi')

.service("AppService", function ($http, URL_API) {
  this.getCities = function () {
      var req = $http.get(URL_API + '/GetCities');
      return req;
  };

  this.getCitiesWithStates = function () {
      var req = $http.get(URL_API + '/GetCitiesWithStates');
      return req;
  };

  this.getCityDetails = function (cityId) {
      var req = $http.get(URL_API + '/GetCityDetails?cityId=' + cityId);
      return req;
  };

  this.sendEmail = function(contactModel){
    var req = $http.get(URL_API + '/SendEmail?name=' + contactModel.Name + '&email=' 
      + contactModel.Email + '&movieTheater=' + contactModel.MovieTheater + '&message=' + contactModel.Message);
    return req;
  }
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

.controller('MovieTheatersCtrl', function($scope, $state, AppService) {
  $scope.Cities = []; 

  var citiesRequest = AppService.getCitiesWithStates();
  citiesRequest.success(function (data) {
      $scope.Cities = data;
  });
})

.controller('CityCtrl', function($scope, $stateParams, $sce, AppService) {
  var citiesRequest = AppService.getCityDetails($stateParams.cityId);
  citiesRequest.success(function (data) {
      $scope.City = data;
      $scope.UrlIframe = $sce.trustAsResourceUrl(data.UrlMap);
      
  });
})

.controller('ContactCtrl', function($scope, AppService) {
  $scope.ContactModel = {
    Name: "",
    Email: "",
    MovieTheater: "",
    Message: ""
  };

  $scope.SendEmail = function(){
    if($scope.ContactModel.Name != "" && $scope.ContactModel.Email != "" && $scope.ContactModel.Message != "") {
      var contactRequest = AppService.sendEmail($scope.ContactModel);
      contactRequest.success(function(data) {
          alert("Contato enviado com sucesso.");
      }).error(function() {
          alert("Erro ao enviar contato.");
      });
    } else {
      alert("Os campos Nome, E-mail e Mensagem são obrigatórios. Preencha todos antes de enviar.");
    }
    
  };
});
