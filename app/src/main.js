require([
    'angular',
    'jquery',
    'angular-resource',
    'angular-ui-router',
    'ui-bootstrap-tpls',
    'bootstrap',
    'common/directive',
    'home/home'
], function(angular) {
    'use strict';

    /*App Module*/
    angular.element(document).ready(function () {

        /*smart works go here*/
        var $html = angular.element('html');

        // remove loading mask
        $html.find('#mask-loading').fadeOut(500, function() {
            $(this).remove();
        });

        angular.module('webApp', [
            'ui.router',
            'ngResource',
            'ui.bootstrap',
            'common.directive',
            'homeModule'
        ]).config(['$urlRouterProvider', '$provide', function($urlRouterProvider, $provide) {
            $urlRouterProvider.otherwise('/');

            /* change configure to use [[ to be the interpolation ([[2 + 2]]) */
            //$interpolateProvider.startSymbol('[[');
            //$interpolateProvider.endSymbol(']]');

            /* add safeApply function for $rootScope - called by $scope.$root.safeApply(fn) */
            $provide.decorator('$rootScope', [
                '$delegate',
                function($delegate) {
                    $delegate.safeApply = function(fn) {
                        var phase = $delegate.$$phase;
                        if (phase === '$apply' || phase === '$digest') {
                            if (fn && typeof fn === 'function') {
                                fn();
                            }
                        } else {
                            $delegate.$apply(fn);
                        }
                    };
                    return $delegate;
                }
            ]);

        }]);

        /*bootstrap model*/
        angular.bootstrap($html, ['webApp']);
    });
});
