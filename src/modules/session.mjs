import Cookies from 'js-cookie';

const cookieKey = 'sessionId';
var sessionId = null;

function getSession() {
  if (!sessionId) sessionId = Cookies.get(cookieKey);
  return sessionId;
}

export default {
  create: (sessionId) => Cookies.set(cookieKey, sessionId, { expires: 30 }),
  get: getSession,
  connect: (socket) => socket.emit('client_connect', getSession()),
  isLogged: () => !!getSession()
};
