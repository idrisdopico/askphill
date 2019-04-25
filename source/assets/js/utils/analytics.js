import bindAll from 'app/utils/bindAll';
import debounce from 'app/utils/debounce';
import toArray from 'app/utils/toArray';

export default class Analytics {
    constructor(options) {
        console.debug('[analytics] ctor');

        // Properties
        this.$elements = false;
        this.elements = false;
        this.listeners = false;
        this.enabled = false;
    }

    detect() {
        if (typeof window.ga !== 'undefined' && typeof window.gaGlobal !== 'undefined') {
            this.enabled = true;
            this.getElements();
            this.setListeners();
            return true;
        }
        return false;
    }

    bindFunctions() {
        bindAll(this, ['assignListener', 'eventHandler']);
    }

    getElements() {
        this.$elements = document.querySelectorAll('[data-tracking="true"]');
        this.elements = toArray(this.$elements);
    }

    setListeners() {
        console.debug('[analytics] setListeners');

        for (let i = 0, l = this.elements.length; i < l; i++) {
            this.assignListener(this.elements[i]);
        }
    }

    assignListener($el) {
        let action = $el.getAttribute('data-action') || false;
        let category = $el.getAttribute('data-category') || false;
        let label = $el.getAttribute('data-label') || false;
        let value = $el.getAttribute('data-value') || false;
        let scroll = $el.getAttribute('data-scroll') || false;
        let target = $el.getAttribute('target') || false;

        if (action) {
            return $el.addEventListener('click', (e) => { return this.eventHandler({e: e, $el: $el, action: action, category: category, label: label, value: value, scroll: scroll, target: target}); }, false);
        }

        return false;
    }

    eventHandler({e, $el, action=null, category=null, label=null, value=null,target=false, scroll=false, timeout=1000}) {
        if (!this.enabled) {
            return false;
        }

        let href = false;

        if (e && target === false) {
            e.preventDefault();
            console.log('preventDefault');
        }

        if ($el) {
            href = $el.getAttribute('href');
        }

        // Prepare to send
        if (href && !scroll) {

            if (target === false) {
                let callback = debounce(() => { return window.location.assign(href); }, timeout);
                window.ga('send', { hitType: 'event', eventCategory: category, eventAction: action, eventLabel: label, eventValue: value, hitCallback: callback });
            } else {
                // Has target (_blank filled in)
                window.ga('send', { hitType: 'event', eventCategory: category, eventAction: action, eventLabel: label, eventValue: value});
            }

        } else {
            window.ga('send', { hitType: 'event', eventCategory: category, eventAction: action, eventLabel: label, eventValue: value });
        }

        console.debug('[analytics] eventHandler - ', $el, action, category, label,  value, href);
    }
}
