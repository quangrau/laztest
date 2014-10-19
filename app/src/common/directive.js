define(['angular'], function(angular) {
	angular.module('common.directive', [])
		.directive("inputcompare", function() {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					key: '@',
					url: '='
				},
				template: '<div class="form-group" ng-class="{\'has-error\': errors}"><label>Url {{key}}:</label><input type="url" name="input_{{key}}" class="form-control" ng-model="url" placeholder="http://lazada.vn/..." required ng-pattern="/https?:\/\/(www\.)?lazada.vn\/?/"><small class="help-block" ng-show="errors">Give me Url from lazada plz...</small></div>',
				link: function(scope, element) {
					var reg = /https?:\/\/(www\.)?lazada.vn\/?/;

					// Check valid url from Lazada
					scope.$watch('url', function(newVal) {
						scope.errors = !reg.test(newVal);
					});
				}
			}
		});
});

