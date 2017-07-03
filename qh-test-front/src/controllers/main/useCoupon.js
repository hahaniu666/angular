(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.useCoupon", {
            url: '/useCoupon',
            views: {
                "@": {
                    templateUrl: 'views/main/useCoupon/index.root.html',
                    controller: ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', function ($scope, $http, $state, $httpParamSerializer, appConfig) {
                        $scope.imgUrl = appConfig.imgUrl;
                        $http.get(appConfig.apiPath + '/common/indexCouponImg?step=2')
                            .success(function (data) {
                                $scope.couponImg = data.img;
                            });

                        /**使用优惠券，跳去首页*/
                        $scope.useCoupon = function () {
                            $state.go("main.index");
                        };

                        /**回退页面*/
                        $scope.fallbackPage = function () {
                            $scope.useCoupon();
                        };
                    }]
                }
            }
        });
    }
    ]);
})();
