angular.module('starter.controllers', [])

.constant('URL_API', 'http://www.cinea.com.br/webapi/')
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

    this.sendEmail = function (contactModel, SECURITY_TOKEN) {
        var req = $http.get(URL_API + '/SendEmail?name=' + contactModel.Name + '&email='
          + contactModel.Email + '&movieTheater=' + contactModel.MovieTheater + '&message=' + contactModel.Message
          + '&token=' + SECURITY_TOKEN);
        return req;
    };

    this.getDatesHorary = function (cityId) {
        var req = $http.get(URL_API + '/GetDatesHorary?cityId=' + cityId);
        return req;
    };

    this.getProgramming = function (cityId, date) {
        var req = $http.get(URL_API + '/GetProgrammingByCityAndDate?cityId=' + cityId + '&date=' + date);
        return req;
    };

    this.getMovieDetails = function (movieId) {
        var req = $http.get(URL_API + '/GetMovieDetails?Id=' + movieId);
        return req;
    };

    this.getMovies = function () {
        var req = $http.get(URL_API + '/GetListOnDisplayAndCommingMovies');
        return req;
    };


    this.searchMovies = function (query) {
        var req = $http.get(URL_API + '/SearchMovies?query=' + query);
        return req;
    };

    this.getPromotionalBanners = function () {
        var req = $http.get(URL_API + '/GetPromotionalBanners');
        return req;
    };

    this.getBannerMobile = function () {
        var req = $http.get(URL_API + '/GetBannerMobile');
        return req;
    };

    this.getHomeMovies = function () {
        var req = $http.get(URL_API + '/GetMoviesToHome');
        return req;
    };
})

.controller('MenuCtrl', function ($scope, $ionicModal) {
    $scope.CloseApplication = function () {
        ionic.Platform.exitApp();
    };
})

.controller('HomeCtrl', function ($scope, $ionicLoading, AppService) {
    ShowLoading($scope, $ionicLoading);

    var bannerMobileRequest = AppService.getBannerMobile();
    bannerMobileRequest.success(function (data) { 
        $scope.BannerMobile = data.Image;        
    });  

    var homeMoviesRequest = AppService.getHomeMovies();
    homeMoviesRequest.success(function (data) {
        $scope.HomeMovies = data;
        HideLoading($ionicLoading);
    });
    
    GetListCities($scope, AppService);
})

.controller('PromotionCtrl', function ($scope, $ionicLoading, AppService) {    
    ShowLoading($scope, $ionicLoading);
    var bannerPromotionsRequest = AppService.getPromotionalBanners();
    bannerPromotionsRequest.success(function (data) {
        $scope.bannersPromotion = data;
        HideLoading($ionicLoading);
    });

    GetListCities($scope, AppService);
})

.controller('SearchCtrl', function ($scope, AppService) {
    $scope.txtsearch = '';

    $scope.doSearch = function () {
        var search = document.getElementById("txt-search").value;

        var searchRequest = AppService.searchMovies(search);
        searchRequest.success(function (data) {
            $scope.Movies = data;
        });
    };
})

.controller('MoviesCtrl', function ($scope, AppService, $ionicLoading) {
    ShowLoading($scope, $ionicLoading);

    $scope.ListOnDisplayIsVisible = true;
    $scope.ListComingSoonIsVisible = false;    

    var moviesRequest = AppService.getMovies();
    moviesRequest.success(function (data) {
        $scope.MoviesOnDisplay = data.moviesOnDisplay;
        $scope.CommingMovies = data.commingMovies;
        HideLoading($ionicLoading);
    });

    $scope.ShowListOnDisplay = function () {
        $(".btn-show-list-on-display").addClass("active");
        $(".btn-show-list-coming-soon").removeClass("active");

        $scope.ListOnDisplayIsVisible = true;
        $scope.ListComingSoonIsVisible = false;   
    };

    $scope.ShowListComingSoon = function () {
        $(".btn-show-list-on-display").removeClass("active");
        $(".btn-show-list-coming-soon").addClass("active");

        $scope.ListOnDisplayIsVisible = false;
        $scope.ListComingSoonIsVisible = true;   
    };

    GetListCities($scope, AppService);
   
})

.controller('MovieTheatersCtrl', function ($scope, $state, $ionicLoading, AppService) {
    ShowLoading($scope, $ionicLoading);
    $scope.Cities = [];    
    var citiesRequest = AppService.getCitiesWithStates();
    citiesRequest.success(function (data) {
        $scope.Cities = data;
        HideLoading($ionicLoading);
    });
})

.controller('CityCtrl', function ($scope, $stateParams, $sce, AppService) {
    var citiesRequest = AppService.getCityDetails($stateParams.cityId);
    citiesRequest.success(function (data) {
        $scope.City = data;
        $scope.UrlIframe = $sce.trustAsResourceUrl(data.UrlMap);

    });
})

.controller('ContactCtrl', function ($scope, $ionicLoading, AppService, SECURITY_TOKEN) {
    $scope.ContactModel = {
        Name: "",
        Email: "",
        MovieTheater: "",
        Message: ""
    };

    $scope.SendEmail = function () {
        if ($scope.ContactModel.Name != "" && $scope.ContactModel.Email != "" && $scope.ContactModel.Message != "") {
            ShowLoading($scope, $ionicLoading);

            var contactRequest = AppService.sendEmail($scope.ContactModel, SECURITY_TOKEN);
            contactRequest.success(function (data) {
                HideLoading($ionicLoading);
                alert("Contato enviado com sucesso.");

                $scope.ContactModel = {
                    Name: "",
                    Email: "",
                    MovieTheater: "",
                    Message: ""
                };

            }).error(function () {
                HideLoading($ionicLoading);
                alert("Erro ao enviar contato.");
            });
        } else {
            alert("Os campos Nome, E-mail e Mensagem são obrigatórios. Preencha todos antes de enviar.");
        }
    };
})

.controller('TicketCtrl', function ($scope, AppService) {

    GetListCities($scope, AppService);

})

.controller('ProgrammingCtrl', function ($scope, $http, $timeout, $stateParams, $ionicLoading, $ionicModal, $sce, AppService, URL_API) {
    $scope.ShowFlexSlide = false;

    $scope.Dates = [];
    $scope.CityName = "";
    $scope.Horaries = [];

    ShowLoading($scope, $ionicLoading);

    var requestDates = AppService.getDatesHorary($stateParams.cityId);
    requestDates.success(function (data) {
        $scope.Dates = data.DateProgrammings;
        $scope.CityName = data.CityName;

        var requestProgramming = AppService.getProgramming($stateParams.cityId, $scope.Dates[0].Date);
        requestProgramming.success(function (programming) {
            $scope.Horaries = programming.horaries;

            HideLoading($ionicLoading);
        });

        $timeout(function () {
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

        ShowLoading($scope, $ionicLoading);
        var programming = AppService.getProgramming($stateParams.cityId, date);
        programming.success(function (programming) {
            $scope.Horaries = programming.horaries;
            HideLoading($ionicLoading);
        });
    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.openTrailler = function (urlTrailer, movieName) {
        $scope.url = $sce.trustAsResourceUrl(urlTrailer);
        $scope.movieNameToTrailer = movieName;
        $scope.modal.show();
    };
})

 .controller('MovieDetailCtrl', function ($scope, $stateParams, $sce, $ionicLoading, AppService) {   
    ShowLoading($scope, $ionicLoading);

    var moviesDetailsRequest = AppService.getMovieDetails($stateParams.movieId);    
    moviesDetailsRequest.success(function (data) {
        $scope.Movie = data;
        $scope.url = $sce.trustAsResourceUrl(data.LinkTrailer);
        HideLoading($ionicLoading);
    });

     GetListCities($scope, AppService);
 })
 
 .controller('ClubCineACtrl', function ($scope, $stateParams, $sce, AppService) {
    
});


function GetListCities($scope, AppService)
{
    $scope.ShowMenu = false;

    $scope.ShowOrHideMenu = function () {
        $scope.ShowMenu = !$scope.ShowMenu;

        if($scope.ShowMenu){
            $(".btn-choose-your-city").removeClass("ion-chevron-down").addClass("ion-chevron-up");
        } else {
            $(".btn-choose-your-city").removeClass("ion-chevron-up").addClass("ion-chevron-down");
        }
    };

    $scope.HideMenu = function () {
        $scope.ShowMenu = false;
        $(".btn-choose-your-city").removeClass("ion-chevron-up").addClass("ion-chevron-down");
    };

    $scope.Cities = [];

    var citiesRequest = AppService.getCities();
    citiesRequest.success(function (data) {
        $scope.Cities = data;
    });
}


function ShowLoading($scope, $ionicLoading) {
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
    });
}

function HideLoading($ionicLoading) {
    $ionicLoading.hide();
}
