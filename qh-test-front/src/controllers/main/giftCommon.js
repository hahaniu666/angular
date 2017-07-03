(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.giftCommon", {
            url: '/giftCommon?id&inviterId&giftNo',
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, false);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/giftCommon/index.root.html',
                    controller: giftCommonController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    giftCommonController.$inject = ['$scope', '$http', '$state', 'appConfig', '$log',
        'alertService', '$timeout', '$compile', '$httpParamSerializer', 'curUser'];
    function giftCommonController($scope, $http, $state, appConfig, $log,
                                  alertService, $timeout, $compile, $httpParamSerializer, curUser) {

        if ($state.params.inviterId) {
            document.cookie = 'inviterId=' + $state.params.inviterId;
        }
        $scope.imgUrl = appConfig.imgUrl;
        $scope.style = {};
        $scope.id = $state.params.id;
        $scope.data = {};
        if ($state.params.giftNo) {
            $scope.data.giftCardCode = $state.params.giftNo;
        }
        $http({
            method: "GET",
            url: appConfig.apiPath + '/giftPackage/info',
            params: ({
                id: $scope.id
            })
        }).then(function (resp) {
            $scope.data = resp.data.data;
            var ele = $compile($scope.data.content)($scope);
            //需要登录的情况下
            if ($scope.data.isLogin === undefined || $scope.data.isLogin === 1) {
                if (curUser.data.code === 'NOT_LOGINED') {
                    $scope.goLogin();
                }
            } else if ($state.params.giftNo) {
                //如果带有giftNo
                $state.go("main.newGift", {id: $state.params.id, giftNo: $state.params.giftNo});
            } else if (curUser.data.code === 'NOT_LOGINED' && !$state.params.giftNo) {
                //没有登录,并且不带有giftNo
                $scope.goLogin();
            }
            angular.element('#giftCommon').append(ele);
        }, function () {
        });

        /**
         * 直接领取
         */
        $scope.getGift = function () {
            var success = $scope.data.successMainImg;
            var id = $scope.data.id;
            if ($scope.data.getEnum !== 'EXCHANGE') {
                $http({
                    method: "GET",
                    url: appConfig.apiPath + '/giftPackage/getGift',
                    params: ({
                        id: $scope.id
                    })
                }).then(function (resp) {
                    $scope.data = resp.data.data;
                    var code = resp.data.code;
                    var errmsg = resp.data.errmsg;
                    if (errmsg === '用户尚未登录' && code === 'ERROR') {
                        $scope.goLogin();
                    } else {
                        alertService.msgAlert("success", "领取成功");
                        $timeout(function () {
                            if (success) {
                                $state.go("main.giftCommon.giftSuccess", {id: id});
                            } else {
                                $state.go("main.center");
                            }
                        }, 1000);
                    }
                }, function () {
                    if ($scope.data === "NOT_LOGINED") {
                        $scope.goLogin();
                    }
                });
            }
        };

        /**
         * 兑换礼品卡和优惠券
         */
        $scope.exchangeGiftCard = function () {
            if (!$scope.data.giftCardCode || $scope.data.giftCardCode === '') {
                alertService.msgAlert('ks-exclamation-circle', '请输入兑换码！');
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + "/coupon/exchange",
                data: $httpParamSerializer({
                    code: $scope.data.giftCardCode,
                    type: $scope.data.exEnum,
                    phone: $scope.data.phone,
                    verifyCode: $scope.data.verifyCode
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var code = resp.data.code;
                var errmsg = resp.data.errmsg;
                if (errmsg === 'NOT_LOGINED' || code === 'NOT_LOGINED') {
                    $scope.goLogin();
                    return;
                }
                alertService.msgAlert('ks-success', '兑换成功！');
                $timeout(function () {
                    if ($scope.data.successMainImg) {
                        $state.go("main.giftCommon.giftSuccess", {id: $scope.data});
                    } else {
                        $state.go("main.center");
                    }
                }, 1000);

            }, function (resp) {
                if (resp.data.code === "NOT_LOGINED") {
                    $scope.goLogin();
                }
            });
        };

        /**去登录*/
        $scope.goLogin = function () {
            $state.go("main.newLogin", {backUrl: window.location.href, wx: 'true'});
        };

        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});

        };

    }
})();
