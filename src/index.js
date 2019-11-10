const seneca = require('seneca');

const service = seneca({
    tag: process.env.TAG || 'iam'
});

if (process.env.TEST) {
    service.test('print');
}

service.use("basic");
service.use("entity");
service.use("user");

service.use('mongo-store', {
        uri: process.env.MONGO_DB_URI || 'mongodb://127.0.0.1:27017/iam',
        options:
            {
                useUnifiedTopology: true
            }
    });


service.use('consul-registry', {
    host: process.env.CONSUL_HOST || '127.0.0.1'
});

service.add({
        role: 'iam',
        cmd: '*'
    },
    function (message, done) {
        this.act({
            ...message,
            role: 'user'
        }, done);
    }
);

service.use('mesh', {
    pin: 'cmd:*,role:iam',
    discover: {
        registry: {
            active: true
        },
        multicast: {
            active: false
        }
    }
});

service.ready(function () {
    console.log('ready, id = ', this.id)
});
