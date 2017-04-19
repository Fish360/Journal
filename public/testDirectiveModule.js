(function () {
    angular
        .module('testDirectives', [])
        .directive('testHello', testHello);

    function testHello() {
        function link(scope) {
            console.log('testHello!!');
        }
        return {
            link: link,
            template: '<h1>Test Hello</h1>'
        };
    }
})();