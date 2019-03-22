1. 找个地方启动redis_exporter，假设地址是`1.2.3.4:9121`
2. 运行`node heartbeat.js 1.2.3.4:9121`

* heartbeat.js会调用prom2json。prom2json已编译，需要Linux环境。
* 监控数据都存在内存，重启就没了。
