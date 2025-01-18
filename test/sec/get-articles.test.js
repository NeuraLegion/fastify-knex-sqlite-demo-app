'use strict'
const t = require('tap')
const startServer = require('../setup-server')
const { SecRunner, TestType } = require('@sectester/runner')

let runner

// Increase the timeout for the tests
jest.setTimeout(15 * 60 * 1000) // 15 minutes

t.test('Security tests for GET /articles', async t => {
  let server

  t.beforeEach(async () => {
    server = await startServer()
    runner = new SecRunner({
      hostname: process.env.BRIGHT_HOSTNAME
    })
    await runner.init()
  })

  t.teardown(async () => {
    await runner.clear()
    await server.close()
  })

  t.test('GET /articles', async t => {
    await runner.createScan({
      tests: [TestType.SQLI, TestType.XSS, 'excessive_data_exposure', 'http_method_fuzzing', 'mass_assignment'],
      attackParamLocations: ['query']
    })
    .threshold('medium')
    .timeout(15 * 60 * 1000)
    .run({
      method: 'GET',
      url: '/articles',
      query: {
        tag: 'string',
        author: 'string',
        favorited: 'string',
        limit: 10,
        offset: 0
      }
    })
    t.end()
  })

  t.end()
})
