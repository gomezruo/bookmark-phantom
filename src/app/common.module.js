import BookmarksService from './services/bookmarks/bookmarks.service';

import OverviewComponent from './states/overview/overview.component';
import ResultsComponent from './states/results/results.component';

import HeaderComponent from './components/header/header.component';
import BookmarkFormComponent from './components/bookmarkForm/bookmarkForm.component';
import BookmarkListComponent from './components/bookmarkList/bookmarkList.component';

export default angular.module('common', [])
.component('cmpOverview', OverviewComponent)
.component('cmpResults', ResultsComponent)
.component('cmpHeader', HeaderComponent)
.component('cmpBookmarkForm', BookmarkFormComponent)
.component('cmpBookmarkList', BookmarkListComponent)
.service('BookmarksService', BookmarksService);
