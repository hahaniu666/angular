(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人中心:没有登陆用户
         */
        $stateProvider.state("main.center", {
            url: "/center",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/center/index.root.html',
                    controller: centerController
                }
            }
        });
    }]);
    centerController.$inject = ['$scope', '$http', '$state', 'userService', 'appConfig', 'imgService', 'alertService', '$mdDialog'];
    function centerController($scope, $http, $state, userService, appConfig, imgService, alertService, $mdDialog) {
        $scope.goLeasingAsset = function () {
            $state.go("main.leasingAsset", {}, {reload: true});
        };
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };


        //获取余额
        $http({
            method: "GET",
            url: appConfig.apiPath + "/wallet/account"
        }).then(function (resp) {
            var data = resp.data;
            $scope.notAmount = data.notAmount;
            $scope.giftAmount = data.giftAmount;
            $scope.canAmount = data.canAmount;
            $scope.couponNum = data.couponNum;
        });

        $scope.gotoTop();
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.slideImg = imgService.slideImg;
        $scope.isLogin = false;
        // 不阻塞首页的界面的加载
        $http.get(appConfig.apiPath + '/user/userInfo', {
            skipGlobalErrorHandler: false,
            showLoginError: false,
            notShowError: false,
            timeout: 10000
        }).then(function (resp) {
            $scope.user = resp.data;
            $scope.user.defaultImg = 'ed5fe350671be4d1e3b20037c4dda58f';
            $scope.isLogin = true;
            // 用户已经登录

            if ($scope.user.userInfo.avatar && $scope.user.userInfo.userId) {
                /*js动态创建*/
                var test = document.getElementById("img-wrap");
                var img = document.createElement("img");
                test.appendChild(img);
                img.setAttribute("class", "img-circle");
                if ($scope.user.userInfo.imgType != 'URLIMG') {
                    img.src = imgService.imgUrl($scope.user.userInfo.avatar, 80, 80);
                } else {
                    img.src = $scope.user.userInfo.avatar;
                }
            }
            $http
                .get(appConfig.apiPath + "/unionOrder/orderStatus")
                .success(function (data) {
                    $scope.status = data;
                }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
            //获取余额
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wallet/account"
            }).then(function (resp) {
                var data = resp.data;
                $scope.notAmount = data.notAmount;
                $scope.giftAmount = data.giftAmount;
                $scope.canAmount = data.canAmount;
                $scope.couponNum = data.couponNum;
            });
        }, function () {
            /*jq方法动态创建标签*/
            // var $aDiv = angular.element('#test');
            // var $mdIcon = angular.element('<md-icon class="img-icon ng-scope md-font ks-logo-o ks-icon" ng-click="login()" md-font-set="ks-icon" md-font-icon="ks-logo-o" role="button" tabindex="0" aria-label="ks-logo-o"></md-icon>');
            // $aDiv.append($mdIcon);

        });

        //获取等级信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/integral/user"
        }).then(function (resp) {
            $scope.data = resp.data;
            for (var i = 0; i < $scope.data.agents.length; i++) {
                if ($scope.data.agent === $scope.data.agents[i].id) {
                    $scope.order = $scope.data.agents[i].order;
                    $scope.name = $scope.data.agents[i].name;
                    $scope.needIntegral = $scope.data.agents[i].integral;
                    $scope.tab = $scope.order;
                }
            }
        }, function () {
        });

        $scope.login = function () {
            var url = window.location.href;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 微信浏览器内直接进行微信登陆
                $http
                    .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + encodeURIComponent(url))
                    .success(function (data) {
                        window.location.href = data.uri;
                    });
                return;
            }
            $state.go("main.newLogin", {backUrl: window.location.href});
        };
        $scope.register = function () {
            var url = window.location.href;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 微信浏览器内直接进行微信登陆
                $http
                    .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + encodeURIComponent(url))
                    .success(function (data) {
                        window.location.href = data.uri;
                    });
                return;
            }
            $state.go("main.register");
        };


        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };

        $scope.toLease = null;
        $scope.staffType = null;
        //判断是否有租赁权限
        $http({
            method: "GET",
            url: appConfig.apiPath + "/staff/userInfoStaff"
        }).then(function (resp) {
            var data = resp.data;
            if (!data.staff) {
                //普通用户，跳转到学生租赁申请
                $scope.toLease = "main.leaseApplication.leaseFirst";
            } else if (data.staff.type === 'EXPRESS') {
                //配送员，跳去租赁申请页面，跳转之前弹窗提醒
                $scope.staffType = 'EXPRESS';
                $scope.toLease = "main.leaseApplication.leaseFirst";
            } else if (data.staff.type === 'HOTEL' || data.staff.type === 'PLATFORM') {
                //酒店用户，不管有没有审核，都跳转到我的租赁
                $scope.toLease = "main.leasingAsset";
            } else if (data.staff.status === 'NORMAL' && (data.staff.isOrg === 'true' || data.staff.isOrg === true)) {
                //租赁用户
                $scope.toLease = "main.leasingAsset";
            } else if (data.staff.status === 'NORMAL' || data.staff.status.indexOf('UNPASS') >= 0) {
                //未提交资质申请，或审核未通过
                $scope.toLease = "main.leaseApplication.leaseFirst";
            } else if (data.staff.status.indexOf('EXAMINE') >= 0) {
                //审核中
                $scope.toLease = "main.leaseApplication.leaseSuccess";
            }
        }, function (resp) {
            if (resp.data.code === 'NOT_LOGINED') {
                //未登录
                $scope.toLease = "main.newLogin";
            }
        });

        //我的租赁
        $scope.goMyLease = function (ev) {
            if ($scope.staffType === 'EXPRESS') {
                $mdDialog.show({
                    templateUrl: 'views/common/xiaoQ/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                        var vm = this;
                        vm.checkSubmit = function () {
                            $mdDialog.hide(true);
                        };
                        vm.cancel = function () {
                            $mdDialog.cancel();
                        };
                    }],
                    controllerAs: "vm"
                })
                    .then(function (answer) {
                        if (answer) {
                            $state.go($scope.toLease, {backUrl: window.location.href}, {reload: true});
                            return;
                        } else {
                            return;
                        }
                    }, function () {

                    });


            } else {
                if ($scope.toLease) {
                    $state.go($scope.toLease, {backUrl: window.location.href}, {reload: true});
                }
            }
        };


        //联系客服
        $scope.contactService = function () {
            location.href = ysf.url();
        };
    }
})();



