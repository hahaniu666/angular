(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.pay", {
                url: "/pay",

                views: {
                    "@": {
                        templateUrl: 'views/main/vip/pay/index.root.html',
                        controller: vipOrderPayController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    vipOrderPayController.$inject = [ '$state','payMenthod'];
    function vipOrderPayController( $state, payService, payMenthod) {
        var vm = this;
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        vm.payMenthod = payMenthod;
        // 所有的支付方式
        vm.list = [
            payService.RMB
        ];
        vm.jfpay = [{name: '钱币支付', payType: "JF_PAY", icon: 'ks-sign-circular'}];
        vm.currentPay = vm.payMenthod.pay;
        // 当前的支付方式
        vm.choosePayMethod = function (pay) {
            if (pay.payType === "JF_PAY" && vm.payMenthod.item.integral < 1) {
                return;
            }
            vm.currentPay = pay;
        };
        // 确定选中的支付方式
        vm.clickPayType = function () {
            vm.payMenthod.pay = vm.currentPay;
            vm.fallbackPage();
        };
    }
})();