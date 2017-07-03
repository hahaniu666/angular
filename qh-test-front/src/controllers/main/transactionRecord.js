(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.transactionRecord", {
                url: "/transactionRecord",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/transactionRecord/index.root.html',
                        controller: transRecordController
                    }
                }
            });
        }]);

    // ----------------------------------------------------------------------------
    transRecordController.$inject = ['$scope','$http', '$state','appConfig'];
    function transRecordController($scope,$http, $state, appConfig) {
         $scope.maxSize = appConfig.maxSize;
         //页面展示页数   5
         $scope.pageSize = appConfig.pageSize;
         //页面展示条数   10
         $scope.pageEnd = false;                 //是否是最后一页
         $scope.curPage = 1;
         $scope.fallbackPage = function(){
             if (history.length===1){
                 $state.go("main.index",null,{reload:true});
             }else{
                 history.back();
             }
         };
        $scope.transRecord = function(page){
            $http({
                method:"GET",
                url:appConfig.apiPath + "/wallet/accountLog?curPage=" + page + "&pageSize=" + $scope.pageSize
            }).then(function(resp){
                var data = resp.data;
                /**
                 * 判断是否是第1页，不是就追加数据
                 */
                if ($scope.curPage > 1) {
                    for (var i = 0; i < data.recList.length; i++) {
                        $scope.counts.recList.push(data.recList[i]);
                    }
                    $scope.counts.curPage = page;
                } else {
                    $scope.counts = data;
                }
                $scope.curPage = data.curPage + 1;
                $scope.totalCount = data.totalCount;
                /**
                 * 判断是否是最后一页
                 */
                if(data.totalCount % $scope.pageSize !== 0){
                    if (Math.floor(data.totalCount / $scope.pageSize) + 1 === data.curPage) {
                        $scope.pageEnd = true;
                    }
                }else{
                    if (Math.floor(data.totalCount / $scope.pageSize) === data.curPage) {
                        $scope.pageEnd = true;
                    }
                }
                //如果只有一页
                if(data.totalCount <= $scope.pageSize){
                    $scope.pageEnd = true;
                    $scope.curPage = 1;
                }
            },function () {
            });
        };
        $scope.transRecord(1);
    }


})();