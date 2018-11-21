'use strict';

const WorkboxPlugin = require('workbox-webpack-plugin');
const ASSET_PATH = process.env.ASSET_PATH || '';
module.exports = () =>
  (
    [
        new WorkboxPlugin.InjectManifest({  
          globDirectory: 'dist/',
			    globPatterns: ['**/*.{html,js,css,png,woff,ico,svg,jpg,gif}'],
          swSrc: './src/public/service-worker.js',
          precacheManifestFilename: 'wb-manifest.[manifestHash].js',
          include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/],
          globIgnores: [
            "sw.js",
            "service-worker.js",
            "client-stats.json",
            "server.js",
            "wb-manifest/*.js",
            "css/main.css"
          ],
          exclude:[/^css\/main\.css$/, /^css\/opera\.css$/, /^opera\.js$/, /^server\.js$/],
          manifestTransforms: [
            (originalManifest) => {
              let manifest = [];
              for(let entry of originalManifest) {
                if(entry.url != 'client-stats' && entry.url != 'css/main.css' && entry.url.indexOf('wb-manifest') === -1) {
                  if(ASSET_PATH != '' && entry.url.indexOf(ASSET_PATH) === -1) {
                    entry.url = ASSET_PATH + entry.url;
                    manifest.push(entry);
                  }else {
                    manifest.push(entry);
                  }
                }
              }
              const warnings = []; 
              return {manifest, warnings};
            }
          ]
        })
    ]
  );
