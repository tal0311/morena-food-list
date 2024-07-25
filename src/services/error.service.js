import { userService } from './user.service.js'

export const errorService = {
  logError,
  setup
}

function setup() {
  window.$error = errorService
}

const logs = []
function logError(err, routeHistory) {
  const errorToLog = _createNewError(err)

  if (import.meta.env.MODE !== 'development') {
    console.error('%cError', _getStyles(), errorToLog)
    logs.push(errorToLog)
    // httpService.post(DEV_BASE_URL, errorToLog)
    return
  }
  logs.push(errorToLog)
  console.info('%cError', _getStyles(), errorToLog)
}

function _createNewError(err) {
  return {
    _id: $utils.makeId(),
    desc: `[Error handler ${err}]`,
    user: userService.getLoggedInUser(),
  }
}

/**
 *
 * @returns {string} css styles
 */
function _getStyles() {
  return 'color:#fff; background:red; padding:5px; border-radius:5px; font-weight:bold'
}
