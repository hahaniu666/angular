(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息
         */
        $stateProvider.state("main.user", {
            url: "/user?s",

            // 通过 resolve 获取的数据，只要state不重新加载，就不会重新发送http请求，
            // 因此可以在子状态之间临时保存一些数据，然后一起提交到服务器上
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/user/index.root.html',
                    controller: userController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    userController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', 'curUser', "alertService", "$mdBottomSheet", '$cookies'];
    function userController($scope, $http, $state, appConfig, imgService, curUser, alertService, $mdBottomSheet, $cookies) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.simpleImg = imgService.simpleImg;
        $scope.user = curUser.data;
        $scope.user.userInfo.avatar = imgService.imgUrl($scope.user.userInfo.avatar, 50, 50);
        $scope.imgUrl = appConfig.imgUrl;
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        /*把手机号中间4位隐藏*/
        if ($scope.user.userInfo.phone) {
            $scope.myphone = $scope.user.userInfo.phone.substr(3, 4);
            $scope.user.hidephone = $scope.user.userInfo.phone.replace($scope.myphone, "****");
        }
        //隐藏邮箱号，如果邮箱名字长度小于3 则隐藏第一个
        if ($scope.user.userInfo.email) {
            $scope.isLength = 1;
            $scope.a = $scope.user.userInfo.email.indexOf("@") - 1;
            if ($scope.a > 3) {
                $scope.isLength = parseInt($scope.a / 2);
            }
            $scope.myemail = $scope.user.userInfo.email.substr($scope.isLength, 2);
            $scope.user.hideemail = $scope.user.userInfo.email.replace($scope.myemail, "****");
        }
        //取地址信息
        if ($scope.user.userInfo.residence) {
            if (!$scope.user.userInfo.residence.pro) {
                $scope.user.userInfo.residence1 =
                    $scope.user.userInfo.residence.city +
                    $scope.user.userInfo.residence.area +
                    $scope.user.userInfo.residence.street;
            } else {
                $scope.user.userInfo.residence1 = $scope.user.userInfo.residence.pro +
                    $scope.user.userInfo.residence.city +
                    $scope.user.userInfo.residence.area +
                    $scope.user.userInfo.residence.street;
            }
        }
        // 用户退出登陆
        $scope.logout = function () {
            var tplIdFrom = $cookies.tplIdFrom;
            alertService.confirm(null, "", "您确定要退出登录?", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "GET",
                        url: appConfig.apiPath + '/j_spring_security_logout'
                    }).then(function () {
                        $state.go("main.index", {tplId: tplIdFrom}, {reload: true});
                    });
                }
            });
        };
        $scope.userAvatarUpdate = function () {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'views/main/user/avatarUpdate/index.root.html',
                controllerAs: "vm",
                controller: ["$httpParamSerializer", "FileUploader", "wxService", function ($httpParamSerializer, FileUploader, wxService) {
                    var vm = this;
                    vm.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };
                    vm.updateAvatar = function () {
                        var ua = window.navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                            wxService.wxUploadImg(1).then(function (data) {
                                $scope.imgs.push(data);
                            });
                        } else {
                            angular.element("#uploaderFile").click();
                        }
                    };
                    var uploader = vm.uploader = new FileUploader({
                        url: appConfig.apiPath + '/common/uploadImgS',
                        autoUpload: true
                    });
                    // FILTERS
                    uploader.filters.push({
                        name: 'customFilter',
                        fn: function () {
                            return this.queue.length < 30;
                        }
                    });
                    uploader.onSuccessItem = function (fileItem, response) {
                        $http({
                            method: "POST",
                            url: appConfig.apiPath + '/user/updateUserInfo',
                            data: $httpParamSerializer({yunFileId: response.id}),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        }).then(function () {
                            $mdBottomSheet.hide(response);
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                            }
                        });
                    };
                }],
                parent: '.ks-main'
            }).then(function (response) {
                if (response) {
                    $scope.user.userInfo.avatar = response.avatar;
                }
            });
        };
        //定义手机号码提交函数
        $scope.phoneClick = function () {
            $state.go("main.user.bindPhone", null, {reload: true});
        };

        //定义用户信息首页电子邮箱提交函数
        $scope.emailClick = function () {
            $state.go("main.user.bindEmail", null, {reload: true});
        };
        //用户等级
        $scope.userLvlClick = function () {
            $state.go("main.user.userLvl", null, {reload: true});
        };

        //真实姓名
        $scope.userNameClick = function () {
            $state.go("main.user.userName", null, {reload: true});
        };
        //生日
        $scope.birthdayClick = function () {
            $state.go("main.user.birthday", null, {reload: true});
        };
        //居住地
        $scope.residenceClick = function () {
            $state.go("main.user.residence", null, {reload: true});
        };
    }
})();


