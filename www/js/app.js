// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.movies', {
      url: '/movies',
      views: {
        'menuContent': {
          templateUrl: 'templates/movies.html',
          controller: 'MoviesCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.promotion', {
    url: '/promotion',
    views: {
      'menuContent': {
        templateUrl: 'templates/promotion.html',
        controller: 'PromotionCtrl'
      }
    }
  })
  .state('app.movietheaters', {
      url: '/movietheaters',
      views: {
        'menuContent': {
          templateUrl: 'templates/movietheaters.html',
          controller: 'MovieTheatersCtrl'
        }
      }
    })
  .state('app.city', {
    url: '/city/{cityId}',
    views: {
      'menuContent': {
        templateUrl: 'templates/city.html',
        controller: 'CityCtrl'
      }
    }
  })
  .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl'
        }
      }
    })
  .state('app.ticket', {
    url: '/ticket',
    views: {
      'menuContent': {
        templateUrl: 'templates/ticket.html',
        controller: 'TicketCtrl'
      }
    }
  })
  .state('app.programming', {
    url: '/programming/{cityId}',
    views: {
      'menuContent': {
        templateUrl: 'templates/programming.html',
        controller: 'ProgrammingCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
