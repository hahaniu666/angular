(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 友情链接
         */
        $stateProvider.state("main.iframe", {
            url: "/iframe?url",
            views: {
                "@": {
                    templateUrl: 'views/main/iframe/index.root.html',
                    controller: iframeController
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    iframeController.$inject = ['$scope',  '$state',  '$stateParams'];
    function iframeController($scope,  $state,  $stateParams) {
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        var url = decodeURIComponent($stateParams.url);

        angular.element("#iframHtml").attr("src", url);
    }
})();