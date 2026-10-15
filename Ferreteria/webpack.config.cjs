
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: /src/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.karma.json',
                    },
                },
            },
            {
                test: /\.(tsx?|jsx?)$/,
                include: /src/,
                exclude: /\.spec\.tsx?$/,
                enforce: 'post',
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['istanbul'],
                    },
                },
            },
        ],
    },
};
