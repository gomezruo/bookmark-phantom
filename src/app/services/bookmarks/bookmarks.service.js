/**
 * The cookies service for various cookie tasks accross the aplication
 */
export default class BookmarksService {

  /** @ngInject */
  constructor(
    $q,
    $http,
  ) {
    this.$q = $q;
    this.$http = $http;

    this.bookmarks = [];
  }

  addBookmark(bookmark) {

  }
}
