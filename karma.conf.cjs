const fs = require('fs');

// Karma necesita un navegador basado en Chromium. Si CHROME_BIN no está definido,
// se busca Chrome (o Edge) en las rutas habituales de Windows, macOS y Linux.
if (!process.env.CHROME_BIN) {
  const local = process.env.LOCALAPPDATA || '';
  const candidatas = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    local + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  const encontrada = candidatas.find((ruta) => fs.existsSync(ruta));
  if (encontrada) process.env.CHROME_BIN = encontrada;
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    // Un solo archivo de entrada (sin comodines): evita el error "reading 'mtime'" de Karma con glob.
    // src/test/index.js carga todos los *.spec.js(x) mediante require.context de webpack.
    files: [{ pattern: 'src/test/index.js', watched: false }],
    preprocessors: { 'src/test/index.js': ['webpack', 'sourcemap'] },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
          // Los CSS e imágenes que importan los componentes no se necesitan en las pruebas
          { test: /\.css$/i, type: 'asset/source' },
          { test: /\.(png|jpe?g|gif|svg|avif|jfif)$/i, type: 'asset/resource' },
        ],
      },
    },

    reporters: ['progress'],
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      // --no-sandbox es necesario en contenedores/CI; en tu PC también funciona
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    singleRun: true,
  });
};

