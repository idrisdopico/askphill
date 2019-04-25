/**
 * Delegate Click:
 * Allows click event delegation
 *
 *  Use it like this in your view:
 * ---------------------------------------------------------------------------
 *  handleSiblingsClick = delegateClick('siblings-classname', callback);
 *  $parent.addEventListener('click', handleSiblingsClick);
 * ---------------------------------------------------------------------------
 *
 *  On click, the provided callback will be called with the sibling element if the click ocurrs:
 *  - On the sibling directly
 *  - Any of the sibling's children
 */

export default function delegateClick(targetClass, callback) {
    return function (ev) {
        let $el = ev.target;
        const $listener = ev.currentTarget;

        while (!$el.classList.contains(targetClass)) {
            if ($el === $listener) return false;
            $el = $el.parentNode;
        }

        callback(ev, $el);
    };
}
