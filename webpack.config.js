"use strict";
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const GoogleFontsWebpackPlugin = require("google-fonts-webpack-plugin");
const HtmlWebpackDisplayLoaderPlugin = require("html-webpack-display-loader-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPolyfillsPlugin = require("html-webpack-polyfills-plugin");
const webpack = require("webpack");

const htmlWebpackPluginOptions = {
    title: "Frame | 1stop-st.org"
};

if (process.env.NODE_ENV === "production") {
    htmlWebpackPluginOptions.minify = {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        preventAttributesEscaping: true,
        processConditionalComments: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true
    };
}

module.exports = {
    entry: {
        main: "./src"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js"
    },
    module: {
        rules: [{
            //
            // .vue拡張子のファイルは、vue-loaderで読み込みます。
            // <template>タグ、<style>タグ、<script>タグの内容が、HTML、CSS、javascriptとして読み込まれます。
            // lang属性を指定した場合には、対応するloader (sass-loader等) で読み込まれます。
            //
            test: /\.vue$/,
            use: [{
                loader: "vue-loader",
                options: {
                    extractCSS: true
                }
            }]
        }, {
            //
            // .js拡張子のファイルは、babel-loaderで読み込みます。
            // 最新の構文で書かれたスクリプトを、現行のブラウザで解釈できるスクリプトに変換してくれます。
            //
            test: /\.js$/,
            use: [{
                loader: "babel-loader"
            }],
            exclude: /(^|\/)node_modules\/(?!@material\/).*/
        }, {
            //
            // 画像ファイルは、url-loaderで読み込みます。
            // ファイルの内容がエンコードされ、スクリプト内に埋め込まれます。
            // 32kB以上のファイルは、file-loaderで読み込みます。
            // ファイル名はハッシュ文字列に置き換えて配信されます。
            //
            test: /\.(?:ttf|woff2?|eot|png)$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 32000,
                    name: "[hash].[ext]"
                }
            }]
        }]
    },
    resolve: {
        alias: {
            //
            // 各モジュールのビルドされたファイルへのエイリアスを設定します。
            // ex.) import vue from "vue" は import vue from "vue/dist/vue.esm" と同じです。
            //
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    node: {
        __filename: true, // 各モジュール内で、そのモジュール自身の相対パスを__filenameで取得できます。
        __dirname: true // 各モジュール内で、そのモジュールを含むディレクトリの相対パスを__dirnameで取得できます。
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        hot: true
    },
    devtool: "chep-module-source-map",
    plugins: [
        //
        // スクリプト内の変数を環境変数で置き換えます。
        // 下記はデフォルト値となります。
        //
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        //
        // EJSテンプレートからindex.htmlを作成します。
        // サイトにアクセスした時、最初に読み込まれるHTMLファイルになります。
        //
        new HtmlWebpackPlugin(htmlWebpackPluginOptions),
        //
        // 画像ファイルからマルチブラウザ対応のfaviconを生成します。
        // 生成されたfaviconへのリンクがindex.htmlに挿入されます。
        //
        new FaviconsWebpackPlugin({
            logo: "./resources/logo.png"
        }),
        //
        // Google Fonts から Webフォントを読み込む<style>タグがindex.htmlに挿入されます。
        //
        new GoogleFontsWebpackPlugin({
            fonts: [{
                family: "Roboto",
                variants: ["300", "400", "500"]
            }],
            local: false
        }),
        //
        // ブラウザに適したPolyfillを読み込む<script>タグがindex.htmlに挿入されます。
        // Polyfill service (https://polyfill.io)
        //
        new HtmlWebpackPolyfillsPlugin({
            features: ["Math.hypot", "Promise"]
        }),
        //
        // script読込み中にロード画面を表示するHTMLが挿入されます。
        //
        new HtmlWebpackDisplayLoaderPlugin({
            id: "frame-root"
        }),
        //
        // 抽出されたスタイルを1つのcssファイルとして読み込みます。
        //
        new ExtractTextPlugin("[contenthash].css"),
        //
        // 開発用サーバーでHot Module Replacement (モジュール単位で変更を反映)を有効にします。
        //
        new webpack.HotModuleReplacementPlugin(),
        //
        // 開発中に変更されたモジュール名をコンソールに表示します。
        //
        new webpack.NamedModulesPlugin()
    ]
};

if (process.env.NODE_ENV === "production") {
    const BabiliPlugin = require("babili-webpack-plugin");
    const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
    module.exports.plugins.push(new BabiliPlugin({
        removeConsole: true,
        removeDebugger: true
    }, {
        comments: false,
        sourceMap: false
    }), new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        }
    }));
}
