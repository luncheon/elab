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
  esbuild.build({
    ...options,
    entryPoints: ['material/material.ts'],
    format: 'esm',
    outdir: undefined,
    outfile: 'material/material.mjs',
    plugins: [
      {
        name: 'local',
        setup: build => {
          // make node_modules external
          build.onResolve({ filter: /^[^.]/ }, args => ({ path: args.path, external: true }))

          // ignore css/scss
          build.onResolve({ filter: /\.s?css$/ }, args => ({ path: args.path, namespace: 'ignore' }))
          build.onLoad({ filter: /.*/, namespace: 'ignore' }, () => ({ contents: '' }))
        },
      },
      ...options.plugins,
    ],
  })
}
