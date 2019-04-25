require('core-js/es6/array');
require('core-js/es6/symbol');

export default function(Parent, ...mixins) {
    class Mixed extends Parent {}
    for (let mixin of mixins) {
        for (let prop in mixin) {
            var descriptor = Object.getOwnPropertyDescriptor(mixin, prop);
            Object.defineProperty(Mixed.prototype, prop, descriptor);
        }
    }

    return Mixed;
};
