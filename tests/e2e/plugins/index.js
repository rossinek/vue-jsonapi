module.exports = (on, config) => {
  return {
    ...config,
    fixturesFolder: 'e2e/fixtures',
    integrationFolder: 'e2e/specs',
    screenshotsFolder: 'e2e/screenshots',
    videosFolder: 'e2e/videos',
    supportFile: 'e2e/support/index.js',
  }
}
