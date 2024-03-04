/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000
    },
    build: {
        outDir: "build"
    },
    plugins: [react(), splitVendorChunkPlugin()],
    define: {
        'process.env': {}
    },
    test: {
        globals: true,
        environment: 'jsdom'
    }
})
