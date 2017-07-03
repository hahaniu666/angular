/**
 * Created by wcy on 16-7-16.
 * 这个是用来做首页上拉切换搜索条的  等以后再做
 */

angular.module('qh-test-front').directive("scrollshow",['$window', function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 70) {
                scope.boolChangeClass = true;
            } else if(this.pageYOffset<130){
                scope.boolChangeClass = false;
            }
            scope.$apply();
        });
    };
}]);
