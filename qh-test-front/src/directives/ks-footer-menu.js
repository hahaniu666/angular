(function () {

    /**
     * 底部通栏.
     * 使用方法: <ks-footer-menu cur="'index'" ></ks-footer-menu>
     * 其中 : cur 可选值有 "index", "gift", "cart", "user"
     *
     */
    angular.module('qh-test-front').directive('ksFooterMenu', ['$log', '$compile', function ($log, $compile) {
        return {
            restrict: 'EA',
            priority: 500,
            templateUrl: 'views/directive/ks-footer-menu/template.html',
            scope: {
                cur: '='
            },
            controller: KsFooterMenuController,
            controllerAs: "footerCtrl",
            link: function (scope, element, attrs, ctrls) {
                element.addClass("ksFooterMenu");
            }
        };
    }]);

    KsFooterMenuController.$inject = ["$scope", 'appConfig', '$http'];
    function KsFooterMenuController($scope, appConfig, $http) {
        var vm = this;
        vm.menus = [
            {
                name: 'index',
                iconLiga: "house-o",
                iconClass: "ks-house-o",
                text: "首页",
                state: "main.index"
            },
            /*{
             name: 'gift',
             iconLiga: "gift-o",
             iconClass: "ks-gift-o",
             text: "福利社",
             state: "main.welfare"
             },*/
            {
                name: 'vip',
                iconLiga: "diamond-o",
                iconClass: "ks-diamond-o",
                text: "VIP会员",
                state: "main.newVip"
            },
            {
                name: 'unionOrder',
                iconLiga: "order-o",
                iconClass: "ks-order-o",
                text: "全部订单",
                state: "main.unionOrder"
            },
            {
                name: 'user',
                iconLiga: "user-o",
                iconClass: "ks-user-o",
                text: "我的",
                state: "main.center"
            }
        ];


        //动态设置按钮是否显示文字
        /*vm.showMenu = 'false';
         $http.get(appConfig.apiPath + "/common/sysConf?key=showIndexMenuText")
         .success(function (data) {
         vm.showMenu = data.value;
         });*/
    }
})();