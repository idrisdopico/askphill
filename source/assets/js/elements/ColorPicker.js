import toArray from '../utils/toArray';

export default class ColorPicker {
    constructor(options) {
        this.toggle = this.toggle.bind(this);

        this.imageClasses = options.images;
        this.$images = this.imageClasses.map(image => toArray(document.querySelectorAll(`.${ image }`)));
        this.$selectors = toArray(document.querySelectorAll(`.${ options.picker } li`));

        this.setListeners();
    }

    setListeners() {
        this.$selectors.forEach($selector => $selector.addEventListener('click', this.toggle));
    }

    toggle(e) {
        const color = e.currentTarget.dataset.color;

        this.$images.forEach( ($imageGroup, i) => {
            $imageGroup.forEach( $image => {
                if ($image.classList.contains(`${ this.imageClasses[i] }--${ color }`)) {
                    $image.classList.add('active')
                } else {
                    $image.classList.remove('active');
                }
            });
        });

        this.$selectors.forEach( $selector => {
            if ($selector === e.currentTarget) {
                $selector.classList.add('active');
            } else {
                $selector.classList.remove('active');
            }
        });
    }
}
