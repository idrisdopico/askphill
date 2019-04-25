/* eslint-env node, commonjs */
/* eslint no-var: 0, vars-on-top: 0, comma-dangle: 0, no-console: 0, object-shorthand: 0, one-var: 0, one-var-declaration-per-line: 0, spaced-comment: 0 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SystemBellPlugin = require('system-bell-webpack-plugin');
var autoprefixerStylus = require('autoprefixer-stylus');


/*
 * Configuration
 * Modify according to project guidelines
 */
var target = 'http://localhost:4567';
var localOnly = false;
var autoprefixerBrowsers = ['last 4 version', 'Firefox >= 20', 'Firefox ESR', 'Opera 12.1', '> 1%', 'last 3 Android version'];
var webpackDevPort = 8124;

// Application entry points
var entries = {
    app: ['./source/assets/js/app.js']
};

var ignoreCommonChunks = [
    //
];

/**
 * Internal variables
 * Proceed with caution
 */
process.noDeprecation = true
var isDebug = process.env.NODE_ENV !== 'production';
var colors, plugins, configurations, configuration;
configure();

/*
 * Main
 */
logger('');
logger(`${process.env.NODE_ENV}`, 'Environment');
logger(`${isDebug}`, 'DEBUG$');
logger(`${target}`, 'Target');

module.exports = {
    devtool: configuration.devtool,
    performance: {
        hints: (isDebug ? false : 'warning')
    },
    devServer: {
        // contentBase: path.resolve(__dirname, 'public'),
        host: (localOnly ? 'localhost' : '0.0.0.0'),
        port: webpackDevPort,
        disableHostCheck: true,
        proxy: {
            '**': {
                target: target,
                xfwd: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'X-FORWARDED-BY': 'webpack',
                },
            }
        }
    },

    // Bundle
    entry: entries,

    output: {
        path: path.resolve(__dirname, 'source/public/'),
        filename: 'js/[name].js',
        publicPath: '/public/',
    },


    resolve: {
        modules: [
            path.resolve(__dirname, 'resources/assets/js'),
            'node_modules'
        ],
        alias: {
            // Uncomment until gsap fixes their modules
            //TweenLite: 'gsap/TweenLite',
            //SplitText: path.resolve(__dirname, 'resources/assets/js/vendors/SplitText.min.js'),
            //ClipRect: path.resolve(__dirname, 'resources/assets/js/vendors/clipRect.js'),
            //DrawSVGPlugin: path.resolve(__dirname, 'resources/assets/js/vendors/DrawSVGPlugin.min.js')
        }
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    compact: false,
                    cacheDirectory: true
                }
            },
            {
                test: /\.styl/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: !isDebug,
                                autoprefixer: true
                            }
                        },
                        {
                            loader: 'stylus-loader',
                            options: {
                                sourceMap: (isDebug ? 'inline' : false),
                                define: {
                                    production: process.env.NODE_ENV === 'production'
                                },
                                use: [
                                    autoprefixerStylus({
                                        browsers: autoprefixerBrowsers
                                    })
                                ]
                            }
                        },
                    ]
                })
            },
            /*
            * UNCOMMENT IF ADMIN REQUIRED
            {
                test: /node_modules\/bootstrap/,
                loader: 'imports-loader?jQuery=jquery'
            },
            */
            /*{*/
                //test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                //loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
            /*}*/
        ]
    },
    plugins: configuration.plugins
};

/**
 * Configure - configure webpack
 * @return void
 */
function configure() {
    colors = {
        bold: '\u001b[1m',
        yellow: '\u001b[1m\u001b[33m',
        red: '\u001b[1m\u001b[31m',
        green: '\u001b[1m\u001b[32m',
        cyan: '\u001b[1m\u001b[36m',
        magenta: '\u001b[1m\u001b[35m',
        reset: '\u001b[39m\u001b[22m'
    };

    /*
     * Plugins
     */
    // Plugins - Common
    plugins = [
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            HAS_DEBUG: JSON.stringify(isDebug),
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: Object.keys(entries).filter(key => key !== 'loader'),
            minChunks: function minChunks(module) {
                // Let filter out what we don't need
                if (module && module.userRequest) {
                    for (var i = 0, l = ignoreCommonChunks.length; i < l; i++) {
                        if (module.userRequest.match(ignoreCommonChunks[i])) {
                            console.log(`${colors.bold} [webpack] keep${colors.reset} ${module.rawRequest} from ${colors.bold} ${module.issuer.rawRequest}${colors.reset}, rule: ${colors.bold} ${ignoreCommonChunks[i]} ${colors.reset}`);
                            return false;
                        }
                    }
                    return module.userRequest.match(/node_modules/);
                }
                return false;
            }
        })
    ];

    // Plugins - Production
    if (!isDebug) {
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                drop_console: true,
                warnings: false,
                screw_ie8: true
            },
            mangle: {
                except: ['Smooth', '$super', '$', 'exports', 'require', '$q', '$ocLazyLoad']
            }
        }));
    } else {
        // Plugins - Development
        plugins.push(new SystemBellPlugin());
    }

    configurations = {
        production: {
            devtool: false,
            plugins: plugins,
            output: {
                publicPath: '/'
            }
        },
        development: {
            devtool: 'source-map',
            plugins: plugins,
            output: {
                publicPath: '/public/'
            }
        },
    };

    configuration = (isDebug ? configurations.development : configurations.production);
}

/**
 * Logs output
 * @param text - String to text to output
 * @param tag - Tag that will be placed in front of the text, default ''
 * @return String
 */
function logger(text, tag) {
    tag = `${colors.bold}[+] ${tag}${colors.reset}:` || '';
    return console.log(tag, text);
}
// EOF
