import BookmarksService from './services/bookmarks/bookmarks.service';
import ValidationService from './services/validation/validation.service';

import OverviewComponent from './states/overview/overview.component';
import ResultsComponent from './states/results/results.component';

import FormComponent from './components/form/form.component';

import BookmarkFormComponent from './components/bookmarkForm/bookmarkForm.component';
import BookmarkListComponent from './components/bookmarkList/bookmarkList.component';
import BookmarkComponent from './components/bookmark/bookmark.component';

export default angular.module('common', [])
.component('cmpOverview', OverviewComponent)
.component('cmpResults', ResultsComponent)
.component('cmpBookmark', BookmarkComponent)
.component('cmpBookmarkForm', BookmarkFormComponent)
.component('cmpBookmarkList', BookmarkListComponent)
.service('ValidationService', ValidationService)
.service('BookmarksService', BookmarksService);
