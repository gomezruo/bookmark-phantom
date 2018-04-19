import template from './bookmarkList.html';
import './bookmarkList.scss';

class controller {
  /** @ngInject */
  constructor(BookmarksService) {
    this.BookmarksService = BookmarksService;
  }

  $onInit() {
    this.BookmarksService.getBookmarks();
  }
}

export default { controller, template };
