'use strict'

const path = require('path')

const buildDir = path.join(__dirname, 'build')
const sourcesDir = path.join(buildDir, 'sources')
const headersDir = path.join(buildDir, 'headers')

const nodeVersion = process.version
const nodeReleaseUrl = 'https://nodejs.org/download/release/' + nodeVersion
const nodeHeadersArchive = 'node-' + nodeVersion + '-headers.tar.gz'

module.exports = {
    nodeVersion: nodeVersion,
    directories: {
        build: {
            path: buildDir
        },
        sources: {
            path: sourcesDir
        },
        headers: {
            path: headersDir
        }
    },
    nodeRelease: {
        url: nodeReleaseUrl,
        files: {
            headers: nodeHeadersArchive
        }
    },
    headerFiles: {
        path: 'include/node/',
        files: [
            {
                name: 'js_native_api.h'
            },
            {
                name: 'js_native_api_types.h'
            },
            {
                name: 'node_api.h'
            },
            {
                name: 'node_api_types.h'
            }
        ]
    }
}