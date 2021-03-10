const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['simple/simple.ts'],
  outdir: 'simple',
  bundle: true,
  minify: true,
  plugins: [require('esbuild-plugin-sass')()],
  logLevel: 'info',
  watch: process.argv.includes('-w'),
})
