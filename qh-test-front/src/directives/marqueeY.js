/**
 * 主页头条
 */
angular.module('qh-test-front').directive('marqueeY', ['$log', '$window', function ($log, $window) {
    function link(scope, element, attrs, controllers) {
        scope.$watch(
            function () {
                return element[0].innerHTML;
            },
            function (newValue, oldValue) {
                //首页头条
                jQuery(element).marquee({
                    scrollSpeed: 15,
                    loop: -1,
                    yScroll: "bottom",
                    pauseSpeed: 1000,
                    pauseOnHover: false,
                    fxEasingShow: "linear"  // 缓冲效果
                });

            });
    }

    return {
        restrict: "AE",
        transclude: false,
        priority: 0,
        //scope: {
        //    marqueeList: "="
        //},
        //template: '<ul class="marquee" style="height: 20px;width: 100%;border:none;background-color:white;">'
        ////+ "<li>111</li>"
        //+ '      <li ng-repeat="item in marqueeList" style="font-size: 12px;">{{item.title}}</li>'
        //+ '</ul>',
        link: link,
        replace: false

    };
}]);

//<li ng-repeat="topline in indexData.topLines" style="font-size: 12px;">{{topline.title}}</li>