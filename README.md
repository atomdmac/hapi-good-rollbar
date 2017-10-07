# hapi-good-rollbar
A `good` reporter for sending messages to the Rollbar service.

# Example
```
hapiServerInstance.register({
register: Good,
options: {
  ops: {
    interval: 1000
  },
  reporters: {
    rollbarReporter = [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', error: '*', request: '*' }]
    }, {
      module: require('good-hapi-rollbar'),
      args: [{
        accessToken: process.env.ROLLBAR_API_TOKEN,
        environment: process.env.ENVIRONMENT,
        captureUncaught: true,
        captureUnhandledRejections: true
      }]
    }]
  }
});
```
