export default function debounce(callback, timeout) {
    let called = false;
    setTimeout(callback, timeout);
    return function() {
        if (!called) {
            called = true;
            callback();
        }
    };
}
