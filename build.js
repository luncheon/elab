const esbuild = require('esbuild')

const options = {
  entryPoints: ['simple/simple.ts', 'material/material.ts'],
  outdir: '.',
  bundle: true,
  minify: true,
  target: 'es2020',
  plugins: [require('esbuild-plugin-sass')()],
  logLevel: 'info',
}

if (process.argv.includes('--serve')) {
  esbuild.serve({ servedir: '.' }, options).then(console.log('http://localhost:8000'))
} else {
  esbuild.build(options)
}
