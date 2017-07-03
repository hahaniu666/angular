(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 更新地址，如果address.js文件选择的是用弹出框，则该js无用
         */
        $stateProvider.state("main.cleaningDetails.dialogClear", {
            url: '/dialogClear',
            views: {
                "@": {
                    controller: 'dialogClearController',
                    templateUrl: 'views/main/cleaningDetails/dialogClear/index.root.html',
                    controllerAs: "vm"
                }
            }
        });
    }]);

})();