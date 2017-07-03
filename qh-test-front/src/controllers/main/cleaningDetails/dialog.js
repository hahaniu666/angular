(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 更新地址，如果address.js文件选择的是用弹出框，则该js无用
         */
        $stateProvider.state("main.cleaningDetails.dialog", {
            url: '/dialog',
            views: {
                "@": {
                    controller: 'dialogController',
                    templateUrl: 'views/main/cleaningDetails/dialog/index.root.html',
                    controllerAs: "vm"
                }
            }
        });
    }]);
})();