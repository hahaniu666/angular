(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.newGift", {
            url: '/newGift?id&giftNo',
            views: {
                "@": {
                    templateUrl: 'views/main/newGift/index.root.html',
                    controller: newGiftController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    newGiftController.$inject = ['$scope', '$http', '$state', 'appConfig', '$rootScope',
        'alertService', '$timeout', '$compile', '$httpParamSerializer', '$interval'];
    function newGiftController($scope, $http, $state, appConfig, $rootScope,
                               alertService, $timeout, $compile, $httpParamSerializer, $interval) {

        $scope.imgUrl = appConfig.imgUrl;
        $scope.style = {};
        $scope.id = $state.params.id;
        $scope.data = {};
        if ($state.params.giftNo) {
            $scope.data.giftCardCode = $state.params.giftNo;
        }

        //判断礼品卡是否已经被领取
        $scope.check = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/coupon/check',
                params: ({
                    giftNo: $scope.data.giftCardCode
                })
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS' && !resp.data.exist) {
                    alertService.msgAlert("cancle", "该礼品卡已经被领取");
                }
            }, function () {
            });
        };

        $scope.getInfo = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/giftPackage/info',
                params: ({
                    id: $scope.id
                })
            }).then(function (resp) {
                $scope.data = resp.data.data;
                if ($state.params.giftNo) {
                    $scope.data.giftCardCode = $state.params.giftNo;
                }
                var ele = $compile($scope.data.content)($scope);
                angular.element('#giftCommon').append(ele);
            }, function () {
            });
        };
        $scope.check();
        $scope.getInfo();

        /**
         * 直接领取
         */
        $scope.getGift = function () {
            var success = $scope.data.successMainImg;
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
                                $state.go("main.giftCommon.giftSuccess");
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
            }).then(function () {
                alertService.msgAlert('ks-success', '兑换成功！');
                $timeout(function () {
                    if ($scope.data.successMainImg) {
                        $state.go("main.giftCommon.giftSuccess", {id: $scope.id});
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


        $scope.fsyzm = "获取验证码";
        $scope.sendCode = function () {
            if (!$scope.data.phone) {
                alertService.msgAlert("cancle", "输入手机号");
                return;
            }
            //发送验证码
            $http({
                method: 'get',
                url: appConfig.apiPath + '/user/sendCode',
                params: {
                    account: $scope.data.phone,
                    codeType: 'SERVICE_VERIFY',
                    regType: 'PHONE'
                }
            }).then(function (data) {
                if (data.data.code === 'SUCCESS') {
                    alertService.msgAlert("success", "已发送");
                    if ($rootScope.intervalStop) {
                        $interval.cancel($rootScope.intervalStop);//解除计时器
                    }
                    var i = 60;
                    $rootScope.intervalStop = $interval(function () {
                        i--;
                        $scope.fsyzm = i + 'S';
                        if (i <= 0) {
                            $scope.fsyzm = "重新获取";
                            var b = $interval.cancel($rootScope.intervalStop);//解除计时器
                            $rootScope.intervalStop = null;
                        }
                    }, 1000);
                }
                else {
                    $scope.fsyzm = "重新获取";
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
