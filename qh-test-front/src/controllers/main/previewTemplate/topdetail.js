(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.previewTemplate.topdetail", {
            url: "/topdetail",
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/topdetail/index.root.html',
                    controllerAs: "vm",
                    controller: topDetailController
                }
            }
        });
    }]);
    topDetailController.$inject = ['$http', '$state', 'appConfig', "alertService", 'imgService', '$httpParamSerializer'];
    function topDetailController($http, $state, appConfig, alertService, imgService, $httpParamSerializer) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;
        vm.simpleImg = imgService.simpleImg;
        vm.slideImg = imgService.slideImg;
        vm.indexBelowImg = imgService.indexBelowImg;
        vm.imgService = imgService;
        vm.myComment = {};
        vm.id = $state.params.id;
        vm.curPage = 1;
        //话题详情
        vm.getInfo = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/info?id=" + vm.id
            }).then(function (resp) {
                var data = resp.data;
                vm.info = data.info;
            })
        };
        vm.getInfo();

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();