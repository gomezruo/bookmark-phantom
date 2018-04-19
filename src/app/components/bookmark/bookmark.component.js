import './bookmark.scss';
import template from './bookmark.html';

const bindings = {
  cmpData: '<',
  cmpDisplay: '@',
}

class controller {
  /** @ngInject */
  constructor(BookmarksService) {
    this.BookmarksService = BookmarksService;
  }

  editBookmark() {
    this.BookmarksService.editBookmark(this.bookmark);
  }

  deleteBookmark() {
    this.BookmarksService.deleteBookmark(this.bookmark);
  }

  $onInit() {
    this.bookmark = this.cmpData;
  }
}

export default { controller, template, bindings };
