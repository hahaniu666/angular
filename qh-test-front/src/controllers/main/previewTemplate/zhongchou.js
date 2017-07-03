(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         *
         */
        $stateProvider.state("main.previewTemplate.zhongchou", {
            url: '/zhongchou',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/zhongchou/index.root.html',
                    controller: previewTemplateZhongchouController
                }
            }
        });
    }]);
    previewTemplateZhongchouController.$inject = ['$scope', 'appConfig', 'imgService', '$http'];
    function previewTemplateZhongchouController($scope, appConfig, imgService, $http) {
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();
