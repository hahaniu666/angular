(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /***
         * 已经登陆用户进行操作
         **/
        $stateProvider.state("main.center.wxShare", {
            url: "/wxShare",
            views: {
                "@": {
                    templateUrl: 'views/main/center/wxShare/index.root.html',
                    controller: wxshareController
                }
            }
        });
    }]);
    wxshareController.$inject=['$scope', '$state', 'wxService'];
    function wxshareController($scope, $state, wxService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        // 分享到朋友圈
        $scope.shareRing = function () {
            if (window.cordova) {
                if (window.cordova) {
                    Wechat.share({
                        text: "This is just a plain string",
                        scene: Wechat.Scene.SESSION
                        // share to Timeline
                    }, function () {

                    }, function () {

                    });
                } else {
                    wxService.initShare();
                }
            } else {
                wxService.initShare();
            }
        };
        $scope.shareFriend = function () {
            if (window.cordova) {
                Wechat.share({
                    text: "This is just a plain string",
                    scene: Wechat.Scene.TIMELINE
                    // share to Timeline
                }, function () {

                }, function () {

                });
            } else {
                wxService.initShare();
            }
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