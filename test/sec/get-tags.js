'use strict'
const t = require('tap')
const startServer = require('../setup-server')
const { SecRunner, TestType } = require('@sectester/runner')

let runner

// Increase the timeout for the tests
const testTimeout = 15 * 60 * 1000 // 15 minutes

// Set the timeout for the tests
jest.setTimeout(testTimeout)

t.test('SecTester integration for GET /tags', async t => {
  let server
  let baseUrl

  t.before(async () => {
    server = await startServer()
    const address = server.server.address()
    baseUrl = `http://localhost:${address.port}`
  })

  t.teardown(() => server.close())

  t.beforeEach(async () => {
    runner = new SecRunner({
      hostname: process.env.BRIGHT_HOSTNAME
    })
    await runner.init()
  })

  t.afterEach(() => runner.clear())

  t.test('excessive_data_exposure and http_method_fuzzing', async t => {
    await runner.createScan({
      tests: [
        'excessive_data_exposure',
        TestType.HTTP_METHOD_FUZZING
      ],
      attackParamLocations: []
    })
    .threshold('MEDIUM')
    .timeout(testTimeout)
    .run({
      method: 'GET',
      url: `${baseUrl}/tags`
    })

    t.end()
  })

  t.end()
})