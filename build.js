const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['simple/simple.ts'],
  outdir: 'simple',
  bundle: true,
  minify: true,
  target: 'es2020',
  plugins: [require('esbuild-plugin-sass')()],
  logLevel: 'info',
  watch: process.argv.includes('-w'),
})
