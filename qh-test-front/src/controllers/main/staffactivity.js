(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.staffactivity", {
                url: "/staffactivity?fromId",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/staffactivity/index.root.html',
                        controller: staffactivityController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------

    staffactivityController.$inject = ['$scope', '$http', '$state', 'appConfig', 'imgService', '$httpParamSerializer', 'curUser', 'wxService', 'alertService'];
    function staffactivityController($scope, $http, $state, appConfig, imgService, $httpParamSerializer, curUser, wxService, alertService) {
        $scope.imgUrl = appConfig.imgUrl;
        $scope.itemImg = imgService.itemImg;
        $scope.slideImg = imgService.slideImg;
        $scope.simpleImg = imgService.simpleImg;
        $scope.fromId = $state.params.fromId;
        $scope.isHide = false;

        $http.get(appConfig.apiPath + "/common/sysConf?key=wxShareTimeLineConfig")
            .then(function (resp) {

                if (wxService.isInWx()) {
                    $scope.$on("$destory", function () {
                        wxService.shareRing(); // 恢复默认绑定
                        wxService.shareFriend();
                    });
                    var link = location.href;
                    var curConf = {
                        title: resp.data.value[0].title, // 分享标题
                        desc: resp.data.value[0].desc,
                        link: resp.data.value[0].url ? resp.data.value[0].url : link,
                        imgUrl: resp.data.value[0].imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            $http({
                                method: "POST",
                                url: appConfig.apiPath + '/integral/shareIntegral',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                }
                            }).then(function (resp) {
                            }, function (resp) {
                            });
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alertService.msgAlert('exclamation-circle', "取消分享");
                        }
                    };
                    wxService.initShareOnStart(curConf);
                }

            }, function (resp) {
                console.log(resp);
            });

        if (!$scope.fromId) {
            $scope.fromId = curUser.data.userInfo.userId;
            $state.go("main.staffactivity", {fromId: $scope.fromId});
        }
        //检查当前用户是否拥有资格
        $http({
            method: "POST",
            url: appConfig.apiPath + '/skuActivity/check',
            data: $httpParamSerializer({
                userId: $scope.fromId
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (data) {
            //没有资格访问
            if (data.code === 'ERROR') {
                $scope.hide();
            }
        }).error(function (data) {

        });
        //来自分享来源信息
        $scope.getFrom = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/user/userInfo?userId=" + $scope.fromId
            }).then(function (resp) {
                var data = resp.data;
                $scope.fromUser = data;
                if ($scope.fromUser.userInfo.avatar.indexOf('http') > -1) {
                    $scope.userAvatar = $scope.fromUser.userInfo.avatar;
                }
            })
        };


        $scope.getFrom();
        $scope.hide = function () {
            $scope.isHide = !$scope.isHide;
        };
    }
})();