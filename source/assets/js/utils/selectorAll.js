import toArray from './toArray';

export default function $a(selector, parent = document) {
    return toArray(parent.querySelectorAll(selector));
}
