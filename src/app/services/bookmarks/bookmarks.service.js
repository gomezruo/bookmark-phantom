/**
 * The cookies service for various cookie tasks accross the aplication
 */
export default class BookmarksService {

  /** @ngInject */
  constructor(
    $state,
    $window,
    ValidationService,
  ) {
    this.$state = $state;
    this.$window = $window;
    this.ValidationService = ValidationService;

    this.bookmarks = [];

    this.bookmarkStatus = '';

    this.newBookmark = '';
  }

  /**
   * Grabs items from localStorage. An empty Array is given as a value if localStorage is empty.
   * @return {Array}
   */
  getBookmarks() {
    return this.bookmarks = JSON.parse(this.$window.localStorage.getItem('bookmarks')) || [];
  }

  /**
   * Adds items to localStorage.
   * @param {Array}
   */
  setBookmarks(bookmarks) {
    this.bookmarks = bookmarks;

    this.$window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  /**
   * Reset variables used by the form
   */
  resetForm() {
    this.bookmarkStatus = '';
    this.newBookmark = '';
  }

  /**
   * Validates bookmark before passing to the results state. The bookmarks array is then de-duped.
   */
  addBookmark() {

    // use the regex service to check the url
    if (!this.ValidationService.checkUrl(this.newBookmark)) {
      this.bookmarkStatus = 'Invalid URL';
      return;
    }

    // change state to results passing bookmark as a state param
    this.$state.go('results', { 'bookmark': this.newBookmark });

    this.bookmarks.push(this.newBookmark);

    this.resetForm();

    // adding and de-duping bookmarks
    this.setBookmarks(this.bookmarks.filter((item, index) => this.bookmarks.indexOf(item) === index));
  }

  /**
   * Assigns bookmark to newBookmark then deletes bookmark.
   * @param {String}
   */
  editBookmark(bookmark) {
    if (!bookmark) return;

    this.newBookmark = bookmark;

    this.deleteBookmark(bookmark);
  }

  /**
   * Removes bookmark and updates localStorage.
   * @param {String}
   */
  deleteBookmark(bookmark) {
    if (!bookmark) return;

    this.setBookmarks(this.bookmarks.filter(item => item !== bookmark));
  }
}
