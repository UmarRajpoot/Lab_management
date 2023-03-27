const {combineReducers} = require('redux');
import Socket_Reducer from './Socket_State/Socket_Reducer';

export default combineReducers({
  Socket_Reducer,
});
