import OverviewComponent from './states/overview/overview.component';
import ResultsComponent from './states/results/results.component';


export default angular
  .module(
    'app.common.components', [
    ],
  )
  .component('cmpOverview', OverviewComponent)
  .component('cmpResults', ResultsComponent);
