const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Check for IPv4 and not internal (localhost)
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIp = getLocalIp();
const configPath = path.join(__dirname, '../config/auto-ip.json');
const config = { localIp };

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`[IP Detection] Local IP detected and saved: ${localIp}`);
