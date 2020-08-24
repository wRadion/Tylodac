import Cookies from 'js-cookie';

const cookieKey = 'sessionId';
var sessionId = null;

function getSession() {
  if (!sessionId) sessionId = Cookies.get(cookieKey);
  return sessionId;
}

function deleteSession() {
  sessionId = null;
  Cookies.remove(cookieKey);
}

export default {
  create: (sessionId) => Cookies.set(cookieKey, sessionId, { expires: 30 }),
  get: getSession,
  isLogged: () => !!getSession(),
  logout: deleteSession
};
