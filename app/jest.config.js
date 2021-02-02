const esModules = ['@ionic', '@ionic-native'].join('|')

module.exports = {
	name: 'ltaunit',
	displayName: 'LTA Unit Testing',
	preset: 'jest-preset-angular',
	coverageDirectory: '../../coverage/app',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			babelConfig: {
				presets: [['@babel/preset-env', { targets: { node: true }, modules: 'commonjs' }]],
				plugins: ['@babel/plugin-syntax-dynamic-import'],
			},
			tsconfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
			astTransformers: {
				before: [
					'jest-preset-angular/build/InlineFilesTransformer',
					'jest-preset-angular/build/StripStylesTransformer',
				],
			},
		},
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	displayName: 'LTA App',
}
