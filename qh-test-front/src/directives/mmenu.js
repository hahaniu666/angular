/**
 * Angular plugin for jQuery.mmenu.
 *
 * jQuery.mmenu:
 *      http://mmenu.frebsite.nl
 */

angular.module('qh-test-front').service('$mmenu', ['$log', '$window', function ($log, $window) {
    var $ = $window.jQuery;
    this.registry = [];

    this.isRegisted = function (jqObj) {
        for (var i = 0; i < this.registry.length; i++) {
            if (jqObj.is(this.registry[i])) {
                return this.registry[i];
            }
        }
        return false;
    };

    this.register = function (jqObj) {
        if (this.isRegisted(jqObj)) {
            return;
        }
        this.registry.push(jqObj);
        return jqObj;
    };

    this.unregister = function (jqObj) {
        for (var i = this.registry.length - 1; i >= 0; i--) {
            if (jqObj.is(this.registry[i])) {
                var value = this.registry.splice(i, 1);
                return value;
            }
        }
    };
}])

    .directive('mmenu', ['$log', '$mmenu', function ($log, $mmenu) {
        function link(scope, element, attrs, controllers) {

            var opts = {},
                conf = {},
                MMENU = 'mmenu';

            if (typeof (scope.mmenu) === "object") {
                opts = angular.extend(opts, scope.mmenu.opts);
                conf = angular.extend(conf, scope.mmenu.conf);
            }

            var $ = window.jQuery;

            // instance jQuery.mmenu
            element.mmenu(opts, conf);

            // register the mmenu instance
            $mmenu.register(element);

            // init callback
            if (scope.mmenu && typeof scope.mmenu.init === 'function') {
                scope.mmenu.init({
                    element: element,
                    remove: remove
                });
            }

            //////////////////////////////////////////////////
            function open() {
                var $ele = element;
                var api = $ele.data("mmenu");
                var panels = $ele.find(" > div ");
                api.openPanel($(panels.get(0)));
                api.open();
            }

            function close() {
                var $ele = element;
                var api = $ele.data("mmenu");
                var panels = $ele.find(" > div ");
                //api.closePanel($(panels.get(0)));
                api.close();
            }

            function remove() {

                close();

                // 1: delete DOM nodes which is move to body's first element
                $mmenu.unregister(element);
                element.remove();
                $log.debug("mmenu.remove =======", element, $mmenu.registry);

                // when ths last mmenu is removed , do following:
                if ($mmenu.registry.length === 0) {

                    // 2: un-wrapper class=mmenu-page single div
                    var $page = $[MMENU].glbl.$page;
                    if ($page.hasClass("mmenu-page")) {
                        $.each($page.prop("class").split(/\s+/), function (i, className) {
                            if (className.startsWith("mm-")) {
                                $page.removeClass(className);
                            }
                        });
                    } else {
                        $($page.children()).unwrap();
                    }
                    //delete $[MMENU].glbl.$page;
                    $[MMENU].glbl.$page = $();

                    // 3: <div id="mm-blocker" />
                    angular.element("#mm-blocker").remove();

                    //var $html = angular.element("html");
                    //$.each($html.prop("class").split(/\s+/), function (i, className) {
                    //    if (className.startsWith("mm-")) {
                    //        $html.removeClass(className);
                    //    }
                    //});
                }

            }

            scope.$on("$destory", function (event) {
                $log.log("============================$destory");
            });
        }

        return {
            restrict: "AE",
            transclude: true,
            // angular ui router's priority is -400 and 400, we need executed after them
            priority: -500,
            template: "<div ng-transclude></div>",
            scope: {
                mmenu: "="
            },
            link: link
        };
    }]);

