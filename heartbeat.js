const exec = require('child_process').exec;

//const exporterHost = process.argv[2] || '11.4.66.166:9121'
const exporterHost = process.argv[2] || 'localhost:9121'
console.log(`exporter host: ${exporterHost}`)

var metrics2log = (jsonStr) => {
    var data = eval(jsonStr);
    var memoryItem = data.filter(x => x.name == 'vmredis_memory_used_bytes')[0];
    if (memoryItem) {
        var log = {};
        memoryItem.metrics.forEach(m => {
            log[m.labels.addr] = parseFloat(m.value);
        });
        return log;
    } else {
        return null;
    }
};

const cmd = `./prom2json http://${exporterHost}/metrics`

var queue_push = (q, x, size) => {
    q.push(x);
    while (q.length > size) {
        q.shift();
    }
}
var beats = [];
var beat_size = 3 * 3600;
var errs = [];
var err_size = 3600;
var push_beat = (x) => { queue_push(beats, x, beat_size); };
var push_err = (e) => { queue_push(errs, e, err_size); };

var check = () => {
    setTimeout(check, 1000);
    var now = new Date()
    exec(cmd, (err, stdout, stderr) => {
        var log = {
            timestamp: now,
            using_ms: Date.now() - now.getTime()
        };
        if (err) {
            log.err = err;
            push_err({timestamp: now, err: err});
        }
        if (stderr) { 
            log.err = stderr;
            push_err({timestamp: now, err: stderr});
        }
        if (stdout) {
            log.data = metrics2log(stdout);
        }
        push_beat(log);
        //console.log(`stdout: ${JSON.stringify(log)}`);
    });
};

check();

/* === server === */

const express = require('express');
const app = express();
const port = 2333;

app.use(express.static('static'));

app.get('/beats', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(beats));
});
app.get('/errs', (req, res) => res.send(errs.map(JSON.stringify).join('\n')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))