/* FIXME - 如果该文件有在用（比如重新修改），则请删除该行。今后会择机根据该是否有该行，来删除该文件。*/

(function () {
    
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 我的订单
         */
        $stateProvider.state("main.commodityList", {
            url: '/commodityList',
            views: {
                "@": {
                    templateUrl: 'views/main/search/commodityList/index.root.html',
                    controller: [ function () {

                    }]
                }
            }
        });
    }]);
})();