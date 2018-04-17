import template from './bookmarkList.html';
import './bookmarkList.scss';

class controller {
  /** @ngInject */
  constructor(BookmarksService) {
    this.BookmarksService = BookmarksService;
  }

  getPageInfo() {
    return {
      title: this.$stateParams.title,
    };
  }

  $onInit() {
    this.bookmarks = this.BookmarksService.bookmarks;
  }
}

export default { controller, template };
