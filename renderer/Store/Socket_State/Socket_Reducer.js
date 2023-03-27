import * as ActionType from './Socket_Actions';

const initialState = {
  socketInstance: [],
};

const Socket_Reducer = (state = initialState, actions) => {
  switch (actions.type) {
    case ActionType.SOCKET_INSTANCE:
      return {
        ...state,
        socketInstance: actions.payload.socket,
      };
    default:
      return state;
  }
};

export default Socket_Reducer;
