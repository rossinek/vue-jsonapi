const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const inputPath = path.join(__dirname, 'src')
const distPath = path.join(__dirname, 'dist')

const entries = fs.readdirSync(inputPath).reduce((entries, namespace) => {
  const fullDir = path.join(inputPath, namespace)
  const entry = path.join(fullDir, 'index.js')
  const output = path.join(distPath, namespace)
  if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
    return entries.concat([{ namespace, entry, output }])
  }
  return entries
}, [])

console.log('Cleaning dist directory...')
execSync(`rm -rf ${distPath}`, { stdio: 'inherit' })
execSync(`mkdir ${distPath}`, { stdio: 'inherit' })
execSync(`cp ${path.join(__dirname, 'index.html')} ${distPath}`, { stdio: 'inherit' })

entries.forEach(({ namespace, entry, output }) => {
  console.log(`Building example "${namespace}"...`)
  execSync(`yarn poi ${entry} --no-clear-console --out-dir ${output} --public-url /${namespace}/ --prod`, {
    cwd: __dirname,
    stdio: 'inherit',
  })
})
