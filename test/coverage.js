/**
 *               __     __
 * .-----.-----.|__|.--|  |.-----.--.--.
 * |__ --|  _  ||  ||  _  ||  -__|  |  |
 * |_____|   __||__||_____||_____|___  |
 *       |__|                    |_____|
 *
 * SPIDEY v0.2.0
 *
 * Copyright (C) 2013 Fabio Cicerchia <info@fabiocicerchia.it>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function repeat(s, n){
    var a = [];
    while(a.length < n){
        a.push(s);
    }
    return a.join('');
}

console.log('Generating code coverage...');
var cov = global._$jscoverage || {},
    ncov = {lines: 0, executed: 0, percentage: 0, files: []},
    fs = require('fs'),
    file, id, line, status, len, color;

for (file in cov) {
    ncov.files[file] = {lines: 0, executed: 0, percentage: 0, source: {}};
    for (id in cov[file].source) {
        line = cov[file].source[id];
        status = cov[file][parseInt(id) + 1] === undefined ? '-' : cov[file][parseInt(id) + 1];
        if (status !== '-') ncov.files[file].lines++;
        if (status > 0) ncov.files[file].executed++;
        ncov.files[file].source[id] = { status: status, line: line };
    }
    ncov.files[file].percentage = 100 / ncov.files[file].lines * ncov.files[file].executed;
    ncov.lines += ncov.files[file].lines;
    ncov.executed += ncov.files[file].executed;
}
ncov.percentage = 100 / ncov.lines * ncov.executed;

var html = '<html>\n';
html += '<head><style>\n';
html += 'body { margin: 0; padding: 18px 10px; font: 12px Verdana, sans-serif; }\n';
html += 'table { border-collapse: collapse; font-size: 12px; width: 100%; }\n';
html += 'table th { color: white; text-align: right; }\n';
html += 'table th:first-child { text-align: left; }\n';
html += 'table td.statements, table td.executed, table td.coverage { text-align: right; }\n';
html += 'table > thead td { font-weight: bold; }\n';
html += 'table > thead th, table > thead td, table > tbody > tr > td { padding: 4px 10px; }\n';
html += 'table > thead > tr:first-child th { background-color: #758691; }\n';
html += 'table > tbody > tr:nth-child(2n + 1) { background-color: #e7e8e9; cursor: pointer; }\n';
html += '.percentage-container { padding: 2px; padding-right: 8px; width: 150px; }\n';
html += 'pre { overflow: auto; }\n';
html += 'pre span.lineno { display: inline-block; }\n';
html += 'pre span.line { display: inline-block; }\n';
html += 'pre span.line.grey { color: grey; }\n';
html += 'pre span.line.green { color: green; }\n';
html += 'pre span.line.red { color: red; }\n';
html += '.percentage { background-color: #DDD; background-color: rgba(0, 0, 0, 0.1); border-radius: 8px 8px 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.5); height: 7px; padding: 1px; position: relative; width: 100%; }\n';
html += '.percentage > span { background-color: #AEDB4B; border-radius: 6px 6px 6px 6px; box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.2) inset, 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 -1px 0 rgba(0, 0, 0, 0.15) inset; display: block; height: 100%; }\n';
html += '.percentage > span:before { position: absolute; width: 25%; height: 100%; left: 0; top: 0; border-right: 1px solid rgba(0,0,0,0.1); content: \' \'; }\n';
html += '.percentage > span:after { position: absolute; width: 25%; height: 100%; left: 50%; top: 0; border-left: 1px solid rgba(0,0,0,0.1); border-right: 1px solid rgba(0,0,0,0.1); content: \' \'; }\n';
html += '.footer { padding-top: 5px; text-align: right; font-style: italic; opacity: 0.7; }\n';
html += '.footer a { text-decoration: underline; }\n';
html += '</style>\n';
html += '<script>\n';
html += 'function onLoad() {\n';
html += 'var elements = document.getElementsByTagName(\'pre\');\n';
html += 'for (var i = 0; i < elements.length; i++) {\n';
html += 'elements[i].style.width = (parseInt(document.getElementsByTagName(\'table\')[0].clientWidth) - 50) + \'px\';\n';
html += '}\n';
html += '}\n';
html += 'function toggle(id) {\n';
html += 'if (document.getElementById(id).style.display === \'none\') {\n';
html += 'document.getElementById(id).style.display = \'table-cell\';\n';
html += '} else {\n';
html += 'document.getElementById(id).style.display = \'none\';\n';
html += '}\n';
html += '}\n';
html += '</script>\n';
html += '</head>\n';
html += '<body onload="onLoad()"><h1>Code Coverage</h1>\n';
html += '<table>\n';
html += '<thead>\n';
html += '<tr><th>File</th><th>Statements</th><th>Executed</th><th>Coverage</th><th></th></tr>\n';

if (ncov.files[file].percentage > 75) {
    color = 'green';
} else if (ncov.files[file].percentage > 50) {
    color = 'orange';
} else if (ncov.files[file].percentage > 25) {
    color = 'red';
} else {
    color = 'grey';
}

html += '<tr><td>Total</td><td class="statements">' + ncov.lines + '</td><td class="executed">' + ncov.executed + '</td><td class="coverage">' + ncov.percentage.toFixed(2) + '%</td>\n';
html += '<td class="percentage-container"><div class="percentage"><span style="width: ' + ncov.percentage + '%; background-color: ' + color + ';"></span></div></td>\n';
html += '</tr>\n';
html += '</thead>\n';
html += '<tbody>\n';
for (file in ncov.files) {
    if (ncov.files[file].percentage > 75) {
        color = 'green';
    } else if (ncov.files[file].percentage > 50) {
        color = 'orange';
    } else if (ncov.files[file].percentage > 25) {
        color = 'red';
    } else {
        color = 'grey';
    }

    //html += '<li><a href="#' + file.replace(/[^a-zA-Z0-9]/g, '_') + '">' + file + ' (' + ncov[file].percentage.toFixed(2) + '%)</a></li>\n';
    html += '<tr onclick="toggle(\'' + file.replace(/[^0-9a-zA-Z]/g, '_') + '\');">\n';
    html += '<td>' + file + '</td><td class="statements">' + ncov.files[file].lines + '</td><td class="executed">' + ncov.files[file].executed + '</td><td class="coverage">' + ncov.files[file].percentage.toFixed(2) + '%</td>\n';
    html += '<td class="percentage-container"><div class="percentage"><span style="width: ' + ncov.files[file].percentage.toFixed(2) + '%; background-color: ' + color + ';"></span></div></td>\n';
    html += '</tr>\n';
    html += '<tr>\n';
    html += '<td id="' + file.replace(/[^0-9a-zA-Z]/g, '_') + '" style="display: none;" colspan="5">\n';
    html += '<pre>\n';
    for (line in ncov.files[file].source) {
        len = Object.keys(ncov.files[file].source).length.toString().length;
        html += '<span class="lineno" title="' + ncov.files[file].source[line].status + ' times">' + (repeat('0', len) + line).slice(-len) + '</span> ';
        if (ncov.files[file].source[line].status === '-') {
            html += '<span class="line grey">';
        } else if (ncov.files[file].source[line].status.toString() === '0') {
            html += '<span class="line red">';
        } else {
            html += '<span class="line green">';
        }
        html += ncov.files[file].source[line].line;
        html += '</span>\n';
    }
    html += '</pre>\n';
    html += '</td>\n';
    html += '</tr>\n';
}
html += '</tbody>\n';
html += '</table>\n';
html += '<div class="footer">Generated using <a href="https://github.com/fabiocicerchia/spidey">Spidey</a> version 0.2.0</div>\n';
html += '</body></html>';

fs.write('report/coverage.json', JSON.stringify(ncov));
fs.write('report/coverage.html', html);
console.log('JSON code coverage saved in: ' + fs.absolute('report/coverage.json'));
console.log('HTML code coverage saved in: ' + fs.absolute('report/coverage.html'));
casper.test.done();