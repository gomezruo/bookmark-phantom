import template from './results.html';

class controller {

  constructor($state, $stateParams, BookmarksService) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.BookmarksService = BookmarksService;
  }

  goToOverview() {
    this.BookmarksService.bookmark = {};
    this.$state.go('overview');
  }

  $onInit() {
    if (!this.$stateParams.bookmark) this.goToOverview();

    this.bookmark = this.$stateParams.bookmark;
  }
}

export default { controller, template };
