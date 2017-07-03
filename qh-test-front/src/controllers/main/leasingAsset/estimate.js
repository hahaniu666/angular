(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset.estimate", {
            url: '/estimate?plID',
            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/estimate/index.root.html',
                    controller:estimateController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    estimateController.$inject = ['$scope', '$http', '$state',  'appConfig','$httpParamSerializer'];
    function estimateController($scope, $http, $state, appConfig,$httpParamSerializer) {
        //回退页面
        var vm = this;
        vm.fallbackPage = function () {
            $state.go("main.leasingAsset", {
                toptrueOrFalse: true
            }, {reload: true});
        };
        //配额速度
        $scope.indexNum=5;

        $scope.clickCur=function (index) {
            $scope.list=[];
            for (var i=0;i<index;i++){
                $scope.list[i]=true;
            }
        };

        //服务态度
        $scope.clickCurTow=function (index) {
            $scope.clickCurT=[];
            for (var i=0;i<index;i++){
                $scope.clickCurT[i]=true;
            }
            $scope.indexNum=index;
        };
        $scope.clickCur(5);
        $scope.clickCurTow(5);
        //提交
        $scope.tijiao=function () {
            $http({
                method: 'POST',
                url: appConfig.apiPath + "/rentItem/comment",
                data:$httpParamSerializer({
                    //配送任务的ID
                    id:$state.params.plID,
                    //评 论 的 内 容
                    content:$scope.textValue,
                    //商 品 评 分 ， 默 认 5 0,1~50
                    quality:$scope.indexNum*10
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $state.go("main.leaseTask.servGetDetails", {
                    servGetDetailsId:$state.params.plID,
                    vmStatus : 5
                }, {reload: true});
            }, function () {

            });
        };
    }

})();
