import { SecRunner } from '@sectester/runner';
import { TestType } from '@sectester/scan';

jest.setTimeout(15 * 60 * 1000); // 15 minutes

describe('GET /tags', () => {
  let runner!: SecRunner;
  let baseUrl!: string;

  beforeAll(async () => {
    // Setup application and get baseUrl
  });

  afterAll(() => {
    // Teardown application
  });

  beforeEach(async () => {
    runner = new SecRunner({
      // Config
    });

    await runner.init();
  });

  afterEach(() => runner.clear());

  it('should not have excessive data exposure or insecure HTTP methods', async () => {
    await runner
      .createScan({
        tests: [TestType.EXCESSIVE_DATA_EXPOSURE, TestType.HTTP_METHOD_FUZZING]
      })
      .threshold(Severity.MEDIUM)
      .timeout(300000) // 5 minutes
      .run({
        method: 'GET',
        url: `${baseUrl}/tags`
      });
  });
});