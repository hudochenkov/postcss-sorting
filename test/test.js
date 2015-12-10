import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';
import path    from 'path';
import plugin  from '../';

function run(t, input, opts = { }) {
    var dir = './fixtures/';

    var inputPath  = path.resolve(dir + input + '.css');
    var expectPath = path.resolve(dir + input + '.expected.css');
    var actualPath = path.resolve(dir + input + '.actual.css');

    var inputCSS = fs.readFileSync(inputPath,  'utf8');
    var expectCSS = fs.readFileSync(expectPath,  'utf8');

    return postcss([ plugin(opts) ]).process(inputCSS)
        .then( result => {
            var actualCSS = result.css;

            fs.writeFileSync(actualPath, actualCSS);

            t.same(result.css, expectCSS);
            t.same(result.warnings().length, 0);
        });
}

test('Should be in expected order in case properties are not grouped', t => {
    return run(t, 'single-group', { 'sort-order': ['position', 'z-index'] });
});

test('Should be in expected order in case of multiple groups', t => {
    return run(t, 'multiple-groups', { 'sort-order': [
        ['position', 'z-index'],
        ['width', 'height']
    ] });
});

test('Should work correctly with one comment in case of 1 group', t => {
    return run(t, 'single-group-comment', { 'sort-order': [
        ['border-bottom', 'font-style']
    ] });
});

test('Should place the leftovers in the end', t => {
    return run(t, 'leftovers-1', { 'sort-order': [
        [ 'font' ],
        [ 'position', 'z-index' ],
        [ 'display' ]
    ] });
});

test('Should place the leftovers in the beginning', t => {
    return run(t, 'leftovers-2', { 'sort-order': [
        [ '...' ],
        [ 'font' ],
        [ 'position', 'z-index' ],
        [ 'display' ]
    ] });
});

test('Should place the leftovers in the beginning of its group', t => {
    return run(t, 'leftovers-3', { 'sort-order': [
        [ 'font' ],
        [ '...', 'position', 'z-index' ],
        [ 'display' ]
    ] });
});

test('Should place the leftovers in the middle of its group', t => {
    return run(t, 'leftovers-4', { 'sort-order': [
        [ 'font' ],
        [ 'position', '...', 'z-index'],
        [ 'display' ]
    ] });
});

test('Should sort properties inside nested rules', t => {
    return run(t, 'nested-rule-1', { 'sort-order': [
        ['top', 'color']
    ] });
});

test('Should sort properties divided by nested rules', t => {
    return run(t, 'nested-rule-2', { 'sort-order': [
        ['top', 'left', 'color']
    ] });
});

test('Should sort variables', t => {
    return run(t, 'variable', { 'sort-order': [
        ['$variable', 'color']
    ] });
});

test('Should sort properties inside at-rules', t => {
    return run(t, 'at-rules', { 'sort-order': [
        ['top', 'color']
    ] });
});

test('Should sort complex case with leftovers', t => {
    return run(t, 'complex-1', { 'sort-order': [
        ['$variable'],
        ['position'],
        ['...', 'border'],
        ['@mixin'],
        ['font']
    ] });
});

test('Should sort at-rules by they parameter name', t => {
    return run(t, 'at-rules-by-parameter', { 'sort-order': [
        ['@mixin', 'border', '@mixin clearfix']
    ] });
});

test('Should preserve indentation', t => {
    return run(t, 'indent', { 'sort-order': [
        ['...'],
        ['>child'],
        ['@media']
    ] });
});

test('Should place nested rules at the end of parent rule', t => {
    return run(t, 'nested-rules', { 'sort-order': [
        ['...'],
        ['>child']
    ] });
});

test('Should sort at-rules regardless its name', t => {
    return run(t, 'at-rules-2', { 'sort-order': [
        ['@atrule'],
        ['...']
    ] });
});

test('Should sort at-rules by name', t => {
    return run(t, 'at-rules-by-name', { 'sort-order': [
        ['@mixin'],
        ['@custom-media'],
        ['@some-rule']
    ] });
});

test.skip('Should use default config if config is empty', t => {
    return run(t, 'at-rules-by-name', { });
});

test.skip('Should work correctly with comments in case of 1 group', t => {
    return run(t, 'single-group-comments', { 'sort-order': [
        ['border-bottom', 'font-style']
    ] });
});
