(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 发票信息
         */
        $stateProvider.state("main.invoice", {
            url: '/invoice?s&orderId',
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/invoice/index.root.html',
                    controller: invoiceController
                }
            }
        });
    }]);
    invoiceController.$inject = ['$mdDialog', '$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', "alertService"];
    function invoiceController($mdDialog, $scope, $http, $state, $httpParamSerializer, appConfig, alertService) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.status = $state.params.s;
        // 判断获取地址是从哪个入口进来的，返回不同的入口
        if ($scope.status) {
            $scope.orderShow = true;
        }
        $scope.curDefault = 0;      //保存当前的默认发票下标
        $scope.orderId = $state.params.orderId;
        // 获取发票
        $scope.queryInvoice = function () {
            $http
                .get(appConfig.apiPath + '/unionOrder/chooseInvoice')
                .success(function (data) {
                    $scope.invoice = data;
                    for (var i = 0; i < $scope.invoice.invoices.length; i++) {
                        $scope.invoice.invoices[i].default = false;
                    }
                    if ($scope.invoice.invoices.length > 0) {
                        $scope.invoice.invoices[0].default = true;
                        $scope.curDefault = 0;
                    }
                })
                .error(function (data) {
                    if (data.code === "NOT_LOGINED") {
                        $state.go("main.newLogin", {backUrl: window.location.href});
                    }
                });
        };
        $scope.queryInvoice();
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        // 订单详情页面修改发票
        $scope.orderUpdateInvoice = function (invoices) {
            var url = "/unionOrder";
            if ($scope.status === 'qhOrder') {
                url = "/qhOrder";
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + url + '/useInvoice',
                data: $httpParamSerializer({
                    orderId: $scope.orderId,
                    invoice: invoices.title,
                    status: $scope.status
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $scope.fallbackPage();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };
        //删除发票
        $scope.deleteInvoice = function (invoice) {
           /* alertService.confirm(null, "确定要删除?", "")*/
            alertService.confirm(null, "", "确定要删除?", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/unionOrder/deleteInvoice',
                        data: $httpParamSerializer(invoice),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        // 判断 state的params 中 srcState 有没有，没有则返回到主页
                        // 需要注意： $state.go(srcState,{},{reload:true})
                        $scope.queryInvoice();
                        alertService.msgAlert("success", "删除成功");
                    }, function (resp) {
                        var data = resp.data;
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };

        // 设置为默认发票
        $scope.setDefault = function (invoices, index) {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/unionOrder/setDefaultInvoice',
                data: $httpParamSerializer({no: invoices.no}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                //不刷新发票列表，如果修改成功调整invoice.invoices数组的值
                $scope.invoice.invoices[index].default = true;
                $scope.invoice.invoices[$scope.curDefault].default = false;
                $scope.curDefault = index;
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
            });
        };

        //打开弹窗
        $scope.openinvdialog = function (isNew, invoice) {
            $mdDialog.show({
                    templateUrl: 'views/main/invoice/invdialog/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    controllerAs: "vm",
                    controller: [function () {
                        var vm = this;
                        vm.cancel = function () {
                            $mdDialog.hide(false);
                        };
                        vm.isNew = isNew;
                        //新增发票
                        if (vm.isNew) {
                            vm.invoieTitle = "新增发票";
                            vm.modalInvoice = {title: null, type: 'PERSONAL', default: false};
                            //修改发票
                        } else {
                            vm.invoieTitle = "修改发票";
                            //把当前点击的发票 的type和title传递进来 让弹窗里面进行引用
                            vm.modalInvoice = {
                                title: invoice.title,
                                type: invoice.type,
                                no: invoice.no,
                                default: invoice.default
                            };
                        }
                        vm.insertInvoice = function () {
                            if (!vm.modalInvoice.title) {
                                alertService.msgAlert("exclamation-circle", "请输入发票抬头");
                                return;
                            }
                            var url = "newInvoice";
                            if (!vm.isNew) {
                                url = "editInvoice";
                            }
                            $http({
                                method: "POST",
                                url: appConfig.apiPath + '/unionOrder/' + url,
                                data: $httpParamSerializer(vm.modalInvoice),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                }
                            }).then(function () {
                                $mdDialog.hide(true);
                            },function () {
                                $mdDialog.hide(false);
                            });
                        };
                    }]
                })
                .then(function (answer) {
                    if (answer) {
                        $scope.queryInvoice();
                    }
                }, function () {
                });
        };

    }
})();