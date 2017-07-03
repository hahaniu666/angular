(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息/修改性别
         */
        $stateProvider.state("main.user.gender", {
            url: "/gender",
            views: {
                "@": {
                    templateUrl: 'views/main/user/gender/index.root.html',
                    controller:genderController
                }
            }
        });
    }]);
    genderController.$inject=['$scope', '$http', '$state', '$httpParamSerializer', 'curUser', 'appConfig'];
    function genderController($scope, $http, $state, $httpParamSerializer, curUser, appConfig) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.user = curUser.data;
        $scope.sex = $scope.user.userInfo.gender;
        $scope.genderfinish = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/updateUserInfo',
                data: $httpParamSerializer({gender: $scope.sex}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})
                $scope.user.userInfo.gender = data.userInfo.gender;
                $scope.fallbackPage();
            }).error(function (data) {
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        $scope.sexCheck = function (sex) {
            $scope.sex = sex;

        };
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();