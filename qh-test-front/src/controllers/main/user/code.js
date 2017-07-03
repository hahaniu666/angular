(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 友情链接详情
         */
        $stateProvider.state("main.user.code", {
            url: "/codee",
            views: {
                "@": {
                    templateUrl: 'views/main/user/code/index.root.html',
                    controller: "userCodeController"
                }
            }
        });
    }]);
    // ----------------------------------------------------------------------------
    angular.module('qh-test-front')
        .controller('userCodeController', ['$timeout', "$scope", "$state", "appConfig", "curUser", "imgService", function ($timeout, $scope, $state, appConfig, curUser, imgService) {
            $scope.fallbackPage = function () {
                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.back();
                }
            };
            $scope.gotoTop = function () {
                window.scrollTo(0, 0);//滚动到顶部
            };
            $scope.gotoTop();
            $scope.imgUrl = appConfig.imgUrl;
            $scope.simpleImg = imgService.simpleImg;
            /** 获取用户信息 */
            $scope.user = curUser.data;
            if ($scope.user.userInfo.phone) {
                /*把手机号中间4位隐藏*/
                $scope.myphone = $scope.user.userInfo.phone.substr(3, 4);
                $scope.user.hidephone = $scope.user.userInfo.phone.replace($scope.myphone, "****");
            }
            /**
             * 用户需要扫描的二维码
             * @type {string}
             */
            $scope.codeUrl = appConfig.share + "?inviterId=" + $scope.user.userInfo.userId;

        }]);
})();