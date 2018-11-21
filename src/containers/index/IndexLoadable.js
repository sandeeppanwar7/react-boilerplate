import { compose } from 'redux';
import Loadable from 'react-loadable';
import LiftFetchData from '../../components/lib/liftfetchdata/liftFetchData';
import LoadingComponent from '../../components/lib/loadingcomponent/LoadingComponent';

const webpackRequireWeakId = () => require.resolveWeak('./Index');

// NOTE: We're making a trade off for more aggresive code splitting (i.e. includes
// action creators) for waterfall requests when fetching the chunk and the data
// in the client.
const enhance = compose(
  LiftFetchData(webpackRequireWeakId),
  Loadable,
);

export default enhance({
  loader: () => import('./Index'),
  LoadingComponent,
  webpackRequireWeakId,
});
