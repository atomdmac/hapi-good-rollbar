const Stream = require('stream');
const _ = require('lodash');
const Rollbar = require('rollbar');

const internals = {
  token : null,
  config : {},
  formatUser(user) {
    return user;
  },
};

class GoodRollbar extends Stream.Writable {
  constructor(config = {}) {
    super({
      objectMode : true,
      decodeStrings : false,
    });
    this._settings = _.defaultsDeep(config, internals);
    this._rollbar = new Rollbar(this._settings);
  }

  _getUser(data) {
    let user = false;

    if (_.get(data, 'request.auth.isAuthenticated')) {
      user = this.formatUser(_.get(data, 'request.auth.credentials'));
    }

    return user;
  }

  _getRequest(data) {
    let request = null;

    if (data.request) {
      request = _.get(data, 'request.raw.req');

      request.socket = {
        encrypted : _.get(data, 'request.server.info.protocol') === 'https',
      };

      request.connection = {
        remoteAddress : _.get(data, 'request.info.remoteAddress'),
      };

      request.user = this._getUser(data);
    }

    return request;
  }

  _write(data, encoding, callback) {
    const request = this._getRequest(data);
    if (
      data.error &&
      (data.error instanceof Error || data.error.isBoom)
    ) {
      this._rollbar.error(data.error, request);
    } else {
      const message = _.isString(data.data) ? data.data : data.data.message;
      this._rollbar.log(message, data, request);
    }

    callback(null, data);
  }
}

module.exports = GoodRollbar;
