export const SOCKET_INSTANCE = 'SOCKET_INSTANCE';

export const getSocket_Payload = socket => ({
  type: SOCKET_INSTANCE,
  payload: {socket},
});

export function getSocketInstance_Data(socket) {
  return dispatch => {
    dispatch(getSocket_Payload(socket));
  };
}
