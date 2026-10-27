'use strict';

const fs = require('fs');
const path = require('path');
const request = require('supertest');
const createApp = require('../../src/app');

const publicDir = path.join(__dirname, '..', '..', 'public');
const assetName = `test-asset-${process.pid}.txt`;
const assetPath = path.join(publicDir, assetName);
const assetContent = 'Public asset';

describe('Public static assets', () => {
  let app;

  beforeAll(() => {
    fs.writeFileSync(assetPath, assetContent);
    app = createApp();
  });

  afterAll(() => {
    fs.rmSync(assetPath, { force: true });
  });

  it('serves assets from /public with public caching headers', async () => {
    const response = await request(app).get(`/public/${assetName}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(assetContent);
    expect(response.headers['cache-control']).toBe('public, max-age=86400');
  });
});
