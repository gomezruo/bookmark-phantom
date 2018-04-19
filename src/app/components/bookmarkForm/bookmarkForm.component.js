import template from './bookmarkForm.html';
import './bookmarkForm.scss';

class controller {
  /** @ngInject */
  constructor(BookmarksService) {
    this.BookmarksService = BookmarksService;
  }

  addBookmark() {
    this.BookmarksService.addBookmark();
  }

  resetStatus() {
    this.BookmarksService.bookmarkStatus = '';
  }
}

export default { controller, template };
