(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leaseTask.servGetDetails", {
            url: '/servGetDetails?servGetDetailsId&vmStatus&r',
            views: {
                "@": {
                    templateUrl: 'views/main/leaseTask/servGetDetails/index.root.html',
                    controller:servGetDetailsController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    servGetDetailsController.$inject = ['$scope', '$http', '$state',  'appConfig','$httpParamSerializer','$mdDialog'];
    function servGetDetailsController($scope, $http, $state, appConfig,$httpParamSerializer,$mdDialog) {

        $scope.imgSSS = appConfig.imgUrl;
        //回退页面
        var vm = this;

        vm.fallbackPage = function () {
            $state.go("main.leasingAsset", {
                r:$state.params.r,
                toptrueOrFalse:true
            }, {reload: true});
        };
        //订单状态
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/rentItem/transportDetail",
            params:{
                id:$state.params.servGetDetailsId
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function (resp) {
            $scope.transportDetailAPIdata=resp.data,
            vm.status=1;
            vm.init = function () {
                var statusMap = {
                       //sent
                    // UN_ASSIGNED:1,    //("待接单"),
                     //REJECTED:2,    //("已拒绝"),
                     UN_SHIPPED:1,    //("待配送"),
                     UNRECEIVED:1,    //("待收货"),
                     //UNCOMMENTED:5,    //("待评价"),
                     //FINISHED:6,    //("已完成"),

                    // take
                    UN_ASSIGNED:1,    //("待接单"),
                    REJECTED:0 ,  //("以拒绝"),
                    WAIT_CONFIRM:2,    //("待验收"), // 当所有被子全部点击验收后，系统判断
                    UNCOMMENTED:3,    //("待评价"),
                    FINISHED:5,    //("已完成");
                    UN_TOOK:1

                };
                //送出,取回
                if($scope.transportDetailAPIdata.sendStatus){
                    vm.status = statusMap[$scope.transportDetailAPIdata.sendStatus];
                }else{
                    vm.status = statusMap[$scope.transportDetailAPIdata.takeStatus];
                }
            };
            vm.init();
            if($state.params.vmStatus && $state.params.vmStatus===2){
                vm.status=2;
            }
        }, function () {

        });

        //收货确定
        $scope.shouhuoqueding=function () {

            $mdDialog.show({
                templateUrl: 'views/main/leaseTask/Dialog/index.root.html',
                parent: angular.element(document.body).find('#qh-wap'),
                targetEvent: null,
                clickOutsideToClose: true,
                fullscreen: false,
                controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                    var vm = this;
                    vm.title = '确认收货';
                    vm.leftButton = "点错了";
                    vm.rightButton = "确认";
                    vm.checkSubmit = function () {
                        $mdDialog.hide(true);
                    };
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                }],
                controllerAs: "vm"
            }).then(function () {
                $http({
                    method: 'POST',
                    url: appConfig.apiPath + "/rentItem/confirm",
                    data:$httpParamSerializer({
                        id:$state.params.servGetDetailsId
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function () {
                    if($scope.transportDetailAPIdata.sendStatus){
                        $state.go("main.leaseTask.servGetDetails", {
                            vmStatus : 2
                        }, {reload: true});

                    }else{
                        $state.go("main.leaseTask.servGetDetails", {
                            vmStatus : 2
                        }, {reload: true});
                    }
                }, function () {
                });
            }, function () {

            });
        };

        $scope.qupinglun=function () {
            $state.go("main.leasingAsset.estimate", {
                plID:$state.params.servGetDetailsId
            }, {reload: true});
        };


        //确认取回
        $scope.querenquhui=function () {

            $mdDialog.show({
                templateUrl: 'views/main/leaseTask/Dialog/index.root.html',
                parent: angular.element(document.body).find('#qh-wap'),
                targetEvent: null,
                clickOutsideToClose: true,
                fullscreen: false,
                controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                    var vm = this;
                    vm.title = '确认取回?';
                    vm.leftButton = "点错了";
                    vm.rightButton = "确认";
                    vm.checkSubmit = function () {
                        $mdDialog.hide(true);
                    };
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                }],
                controllerAs: "vm"
            }).then(function () {
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/rentItem/confirmTake",
                    params:{
                        id:$state.params.servGetDetailsId
                    }
                }).then(function () {

                    $state.go("main.leaseTask.servGetDetails", {
                    }, {reload: true});

                }, function () {

                });
            }, function () {

            });

        };
        //确认验收
        $scope.querenyanshou=function () {
            
        };

    }

})();
