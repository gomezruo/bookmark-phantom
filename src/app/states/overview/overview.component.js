import template from './overview.html';
import './overview.scss';

const bindings = {
  cmpIsStateOpen: '<?',
};

class controller {

  constructor() {
    this.cmpIsStateOpen = !!this.cmpIsStateOpen;
  }

  get componentClasses() {
    return {
      'overview--is-state-open': this.cmpIsStateOpen,
    };
  }

  toggleState() {
    this.cmpIsStateOpen = !this.cmpIsStateOpen;
  }

}

export default { bindings, template, controller };
