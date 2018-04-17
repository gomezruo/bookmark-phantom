import template from './header.html';
import './header.scss';

class controller {
  /** @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
  }

  getPageInfo() {
    return {
      title: this.$stateParams.title,
    };
  }

  $onInit() {
    this.pageInfo = this.getPageInfo();
  }
}

export default { controller, template };
