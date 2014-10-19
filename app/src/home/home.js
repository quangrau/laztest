define(['angular', 'lodash', 'angular-ui-router'], function(angular, _) {
  angular.module('homeModule', ['ui.router']).config(['$stateProvider', function($stateProvider) {
    /*config path for home page*/
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'src/home/home.tpl.html',
      controller: 'HomeController'
    });
  }]).controller('HomeController', [
  '$scope',
  '$location',
  '$http',
  '$q',
  function($scope, $location, $http, $q) {

    // initialize
    $scope.products = [
      {
        url: 'http://www.lazada.vn/nokia-105-man-hinh-mau-14-xanh-76651.html'
      },
      {
        url: 'http://www.lazada.vn/hongkong-electronics-v1-2-sim-den-237046.html'
      }
    ];

    // init product detail
    $scope.products_detail = []

    // function parse DOM element to get data detail
    parseData = function(domEl) {
      var product_detail = {},
          keys    = [],
          values  = []
          attrRows  = domEl.find('div#productSpecifications table tr');

      product_detail['name']  = domEl.find('div#prod_content_wrapper h1').text();
      product_detail['image'] = domEl.find('div#prdMedia .prod_img .productImage').attr('data-image-initial');

      for (var i = 0; i < attrRows.length; i++) {
        var row   = angular.element(attrRows[i]),
            key   = row.children().first().text(),
            value = row.children().last().html().replace(/<\/?[^>]+(>|$)/g, ""),
            obj   = {};

        product_detail[key] = value;
        // product_detail.push(obj);
      }

      return product_detail;
    };

    // function compare product
    compareProducts = function() {
      // loop to all products and get data
      var promises = $scope.products.map(function(product) {

        var deffered = $q.defer();

        $http.get('http://www.corsproxy.com/' + product.url.replace('http://', '')).
          then(function(res) {
            // Wraps a raw DOM element or HTML string as a jQuery element.
            pageElement = angular.element(res.data);

            // call function to parseHTML from url
            var detail = parseData(pageElement);

            $scope.products_detail.push(detail);

            deffered.resolve(detail);

          }, function(res) {
            deffered.reject('can not get data.');
          });

        return deffered.promise;

      });

      return $q.all(promises);
    };

    $scope.compare = function(urlForm) {
      // Check form valid
      if (urlForm.$invalid) {
        return false;
      }

      // Init scope state
      $scope.product_info = [];
      $scope.products_detail = [];
      $scope.isWaiting = true;
      $scope.showProduct = false;
      $scope.parse_error = false;

      // call function compare products
      compareProducts().then(function(products_detail) {
        var keys = [];

        var data = _.map(products_detail, function(product) {
              _.merge(keys, _.keys(product));
              $scope.product_info.push(_.values(product).splice(0, 2));
              return _.values(product).splice(2);
            });

        // assign to scope
        $scope.keys = _.uniq(keys).splice(2);
        $scope.products_detail = data;
        $scope.isWaiting = false;
        $scope.showProduct = true;
      }, function(reason) {
        $scope.isWaiting = false;
        $scope.parse_error = 'Something wrong! You should try again with other urls.';
      });
    }
  }
  ]);
});

