import Cookies from 'js-cookie'

const TokenKey = 'setToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove('account')
  Cookies.remove(TokenKey)
  Cookies.remove('ssid')
  return
}
