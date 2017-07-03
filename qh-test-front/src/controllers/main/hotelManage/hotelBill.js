(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelBill", {
                url: "/hotelBill",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelBill/index.root.html',
                        controller: hotelBillOrderController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelBillOrderController.$inject = [ '$http', 'appConfig', 'alertService'];
    function hotelBillOrderController($http,appConfig, alertService) {
        var vm = this;
        vm.data = {recList: []};       //接收的数据
        vm.pageEnd = false;
        vm.type = null;
        vm.pageSize = appConfig.pageSize;

        vm.choose = 1;

        /*存月份*/
        vm.dateMonth = [];

        /*获取当前时间*/
        var date = new Date();
        var curMonth = date.getMonth() + 1;
        var curYear = date.getFullYear();
        vm.year = curYear;
        vm.month = curMonth;
        var curDate = {
            year: curYear,
            month: curMonth
        };
        for (var i = 0; i < 12; i++) {
            /*需要的数据*/
            var needDate = {
                year: curDate.year,
                month: curDate.month
            };
            curDate.month--;
            if (curDate.month <= 0) {
                curDate.month = 12;
                curDate.year--;
            }
            /*将需要的数据添加到月份数组*/
            vm.dateMonth.push(needDate);
        }
        vm.pageEnd = false;
        vm.curPage = 0;
        //获取数据
        vm.loadData = function () {
            if (!vm.pageEnd) {
                vm.curPage++;
                $http.get(appConfig.apiPath + "/hotelOrder/list", {
                    params: {
                        curPage: vm.curPage,
                        pageSize: vm.pageSize,
                        type: vm.type,                //type为空,则获取全部,OVERDUE("逾期"),NOPAY("当月未支付"),PAY("当月已结清")
                        month: vm.month,
                        year: vm.year
                    }
                }).success(function (data) {
                    if (vm.data.recList.length > 0) {
                        for (var i = 0; i < data.recList.length; i++) {
                            vm.data.recList.push(data.recList[i]);
                        }
                    } else {
                        vm.data = data;
                    }

                    if (data.curPage * data.pageSize >= data.totalCount) {
                        vm.pageEnd = true;
                    }
                });
            }
        };


        /*选项卡*/
        vm.statusChoose = function (year, month, type) {
            vm.year = year;
            vm.month = month;
            vm.type = type;

            vm.pageEnd = false;
            vm.curPage = 0;
            vm.data = {recList: []};
            vm.loadData(vm.year, vm.month, vm.type);
        };


        /*上边的四个显示*/
        vm.chooseType = function (year, month, type, index) {
            vm.year = year;
            vm.month = month;
            vm.type = type;

            vm.choose = index;

            vm.pageEnd = false;
            vm.curPage = 0;
            vm.data = {recList: []};
            vm.loadData(vm.year, vm.month, vm.type);
        };

        /*获取数据*/
        vm.loadData(curYear, curMonth, vm.type);

        /**发送模板消息**/
        vm.sendTemplate = function (orgId, num, msg) {
            alertService.confirm(null, "", "确定" + msg + "？", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/hotelOrder/sendTemplateMsg',
                        data: {
                            id: orgId,
                            num: num,
                            month: vm.month
                        }
                    }).then(function (resp) {
                        var data = resp.data;
                        if (data.code === 'SUCCESS') {
                            if (data.success) {
                                alertService.msgAlert("success", "已发送");
                            } else {
                                alertService.msgAlert("exclamation-circle", data.msg);
                            }
                        }
                    });
                }
            });
        };
    }
})();