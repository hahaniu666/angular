/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.unionOrder.refund", {
                url: "/refund?orderId&type",
                views: {
                    "@": {
                        templateUrl: 'views/main/unionOrder/refund/index.root.html',
                        controller: refundController,
                        controllerAs: "vm"
                    }
                }
            });

            // ----------------------------------------------------------------------------
            refundController.$inject = ['$scope', '$http', '$state', '$stateParams', 'appConfig', '$httpParamSerializer', 'alertService'];
            function refundController($scope, $http, $state, $stateParams, appConfig, $httpParamSerializer, alertService) {
                var vms = this;
                var id = $stateParams.orderId;
                var type = $stateParams.type;
                vms.checkSubmit = function () {
                    if (!vms.reason || vms.reason === "") {
                        alertService.msgAlert("exclamation-circle", "请填写退货原因");
                        return;
                    }
                    // 租赁的订单和普通的订单，处理退款是不一样的流程
                    var url = "/order/cancel";
                    if (type === 'RENT') {
                        url = "/rentOrder/cancel";
                    } else if (type === 'CLEAN') {
                        url = "/clean/cancel";
                    }
                    // 订单进行退款
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + url,
                        data: $httpParamSerializer({
                            orderId: id,
                            reason: vms.reason,
                            memo: vms.memo
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        $state.go("main.unionOrder", null, {reload: true});
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                };
                $scope.fallbackPage = function () {
                    if (history.length === 1) {
                        $state.go("main.index", null, {reload: true});
                    } else {
                        history.back();
                    }
                };
                //说明 里面 剩余字数实时变化
                //初始化
                vms.numWords = 200;
                vms.checkText = function () {
                    if (vms.memo.length > 200) {
                        vms.memo = vms.memo.substr(0, 200);
                    }
                    //剩余字数
                    vms.numWords = 200 - vms.memo.length;
                };

            }

        }]);


})();