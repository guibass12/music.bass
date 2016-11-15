musicbass.directive('compare', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compare"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compare = function(modelValue) {
                var r = modelValue == scope.otherModelValue;
                return r;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});