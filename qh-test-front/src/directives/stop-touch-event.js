(function () {

    /**
     * 防止md-bottom-sheet中的 md-content 无法滚动，需要: <md-content stop-touch-event > 。
     *
     * 参考： https://github.com/angular/material/issues/2073
     */
    angular.module('qh-test-front').directive('stopTouchEvent', ['$log', '$compile', function ($log, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('touchmove', function (evt) {
                    evt.stopPropagation();
                });
            }
        };
    }]);
})();