#!/usr/bin/env node

const fs = require('node:fs')

fs.rmSync('dist', { recursive: true, force: true })

require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: {
      library: 'src/library.ts',
      input: 'src/input.ts',
      context: 'src/context.ts',
      output: 'src/output.ts'
    },
    bundle: false,
    outdir: 'dist',
    platform: 'browser',
    minify: false,
    sourcemap: false
  })
  .catch(() => process.exit(1))
