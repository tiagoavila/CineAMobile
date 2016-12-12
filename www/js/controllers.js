angular.module('starter.controllers', [])

.constant('URL_API', 'http://www.cinea.com.br/webapi')
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
  };

  this.getDatesHorary = function (cityId) {
    var req = $http.get(URL_API + '/GetDatesHorary?cityId=' + cityId);
    return req;
  };

  this.getProgramming = function(cityId, date) {
    var req = $http.get(URL_API + '/GetProgrammingByCityAndDate?cityId=' + cityId + '&date=' + date);
      return req;
  };

  this.searchMovies = function(query) {
    var req = $http.get(URL_API + '/SearchMovies?query=' + query);
      return req;
  }
})

.controller('MenuCtrl', function($scope, $ionicModal) {
  $scope.CloseApplication = function () {
    ionic.Platform.exitApp();
  };
})

.controller('HomeCtrl', function($scope, AppService) {
  $scope.ShowMenu = false;

  $scope.ShowOrHideMenu = function(){
    $scope.ShowMenu = !$scope.ShowMenu;
  };

  $scope.HideMenu = function(){
    $scope.ShowMenu = false;
  };

  $scope.Cities = []; 

  var citiesRequest = AppService.getCities();
  citiesRequest.success(function (data) {
      $scope.Cities = data;
  });
})

.controller('PromotionCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function($scope, AppService) {
  $scope.txtsearch = '';

  $scope.doSearch = function(){
    var search = document.getElementById("txt-search").value;

    var searchRequest = AppService.searchMovies(search);
    searchRequest.success(function(data) {
        $scope.Movies = data;
      });
  };
})

.controller('MoviesCtrl', function($scope, $ionicModal, $sce) {  

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
})

.controller('ProgrammingCtrl', function($scope, $http, $timeout, $stateParams, $ionicLoading, AppService, URL_API) {
  $scope.ShowFlexSlide = false;

  $scope.Dates = [];
  $scope.CityName = "";
  $scope.Horaries = [];

  function ShowLoading(){
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
    });
  }

  function HideLoading() {
    $ionicLoading.hide();
  };

  ShowLoading();
  var requestDates = AppService.getDatesHorary($stateParams.cityId);
  requestDates.success(function (data) {
    $scope.Dates = data.DateProgrammings;
    $scope.CityName = data.CityName;

    var requestProgramming = AppService.getProgramming($stateParams.cityId, $scope.Dates[0].Date);
    requestProgramming.success(function (programming){
      $scope.Horaries = programming.horaries;

      HideLoading();
    });

    $timeout(function(){
        $('.flexslider-horaries').flexslider({
          animation: "slide",
          slideshow: false,
          itemWidth: 113,
          itemMargin: 0,
          minItems: 4,
          maxItems: 4,
          controlNav: false,
          directionNav: false,
          move: 1,
          touch: true
        });

        $('.btn-prev').on('click', function () {
          $('.flexslider-horaries').flexslider('prev');
          return false;
        });

        $('.btn-next').on('click', function () {
          $('.flexslider-horaries').flexslider('next');
          return false;
        });

        $scope.ShowFlexSlide = true;
      }, 2000);      
  });

  $scope.ChangeDateAndGetHoraries = function ($event, date) {
    $(".flexslider-horaries li.active").removeClass("active");
    $event.currentTarget.className += " active";

    ShowLoading();
    var programming = AppService.getProgramming($stateParams.cityId, date);
    programming.success(function (programming) {
        $scope.Horaries = programming.horaries;
        HideLoading();
    });
  };
});
