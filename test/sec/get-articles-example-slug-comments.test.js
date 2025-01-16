'use strict'
const t = require('tap')
const startServer = require('../setup-server')
const { SecRunner, TestType, AttackParamLocation, Severity } = require('@sectester/runner')

let runner


t.test('setup', async t => {
  runner = new SecRunner({
    hostname: process.env.BRIGHT_HOSTNAME
  })
  await runner.init()
  t.end()
})

t.teardown(async () => {
  await runner.clear()
})

t.test('GET /articles/example-slug/comments', async t => {
  const server = await startServer()
  t.teardown(() => server.close())

  await runner
    .createScan({
      tests: [TestType.ExcessiveDataExposure, TestType.BrokenAccessControl, 'CSRF', TestType.XSS],
      attackParamLocations: [AttackParamLocation.QUERY, AttackParamLocation.BODY, AttackParamLocation.HEADER]
    })
    .threshold(Severity.MEDIUM)
    .timeout(15 * 60 * 1000) // 15 minutes
    .run({
      method: 'GET',
      url: 'http://localhost:3000/articles/example-slug/comments'
    })

  t.end()
})
