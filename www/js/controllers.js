angular.module('starter.controllers', [])

.constant('URL_API', 'http://cinea.com.br/webapi')
//.constant('URL_API', 'http://localhost:42550/webapi')
.constant('SECURITY_TOKEN', 'Cine@1015!')

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

  this.sendEmail = function(contactModel, SECURITY_TOKEN){
    var req = $http.get(URL_API + '/SendEmail?name=' + contactModel.Name + '&email=' 
      + contactModel.Email + '&movieTheater=' + contactModel.MovieTheater + '&message=' + contactModel.Message 
      + '&token=' + SECURITY_TOKEN);
    return req;
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

.controller('MovieTheatersCtrl', function($scope, $state, $ionicLoading, AppService) {
  function ShowLoading(){
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
    });
  }

  function HideLoading() {
    $ionicLoading.hide();
  };

  $scope.Cities = []; 

  ShowLoading();
  var citiesRequest = AppService.getCitiesWithStates();
  citiesRequest.success(function (data) {
      $scope.Cities = data;
      HideLoading();
  });
})

.controller('CityCtrl', function($scope, $stateParams, $sce, AppService) {
  var citiesRequest = AppService.getCityDetails($stateParams.cityId);
  citiesRequest.success(function (data) {
      $scope.City = data;
      $scope.UrlIframe = $sce.trustAsResourceUrl(data.UrlMap);
      
  });
})

.controller('ContactCtrl', function($scope, $ionicLoading, AppService, SECURITY_TOKEN) {
  function ShowLoading(){
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
    });
  }

  function HideLoading() {
    $ionicLoading.hide();
  };

  $scope.ContactModel = {
    Name: "",
    Email: "",
    MovieTheater: "",
    Message: ""
  };

  $scope.SendEmail = function(){
    if($scope.ContactModel.Name != "" && $scope.ContactModel.Email != "" && $scope.ContactModel.Message != "") {
      ShowLoading();

      var contactRequest = AppService.sendEmail($scope.ContactModel, SECURITY_TOKEN);
      contactRequest.success(function(data) {
          HideLoading();
          alert("Contato enviado com sucesso.");

          $scope.ContactModel = {
              Name: "",
              Email: "",
              MovieTheater: "",
              Message: ""
            };

      }).error(function() {
          HideLoading();
          alert("Erro ao enviar contato.");
      });
    } else {
      alert("Os campos Nome, E-mail e Mensagem são obrigatórios. Preencha todos antes de enviar.");
    }
    
  };
})

.controller('TicketCtrl', function($scope) {
  
});
