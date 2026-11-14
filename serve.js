#!/usr/bin/env node

/**
 * Dev Server with Mobile QR Code Scanner
 * 
 * Usage:
 *   node serve.js
 *   ./serve.sh
 *   ./serve.js [port]
 * 
 * Binds to 0.0.0.0 so both local browser and mobile devices on the same Wi-Fi
 * can access the site. Prints a scannable terminal QR code for your phone.
 */

const { spawn, execSync } = require('child_process');
const os = require('os');
const path = require('path');

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Usage:
  ./serve.sh [port]
  node serve.js [port]

Options:
  [port]        Port number to listen on (default: 8000)
  -h, --help    Show this help message
`);
    process.exit(0);
}

const rawArg = process.argv[2];
const port = (rawArg && !rawArg.startsWith('-') ? rawArg : null) || process.env.PORT || '8000';
const rootDir = __dirname;

// Detect the best local network IP address (Wi-Fi / Ethernet)
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    const candidates = [];

    for (const [name, addrs] of Object.entries(interfaces)) {
        for (const addr of addrs) {
            if (addr.family === 'IPv4' && !addr.internal) {
                let score = 0;
                // Prioritize physical network adapters (en0 is Wi-Fi on macOS)
                if (/^(en|eth|wlan)/i.test(name)) score += 10;
                if (/^192\.168\./.test(addr.address)) score += 5;
                else if (/^10\./.test(addr.address)) score += 4;
                else if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(addr.address)) score += 3;
                // Demote virtual / VPN interfaces
                if (/^utun|^docker|^vbox|^tailscale/i.test(name)) score -= 20;

                candidates.push({ name, ip: addr.address, score });
            }
        }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].ip : 'localhost';
}

// Generate terminal-renderable QR code
function renderQrCode(url) {
    try {
        // Method 1: npx qrcode (clean terminal utf-8 block rendering)
        return execSync(`npx --yes qrcode "${url}" --small`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore']
        });
    } catch (e1) {
        try {
            // Method 2: Python qrcode fallback (via uv run)
            const pyCmd = `import qrcode; qr = qrcode.QRCode(); qr.add_data("${url}"); qr.print_ascii(invert=True)`;
            return execSync(`uv run --with qrcode python -c '${pyCmd}'`, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'ignore']
            });
        } catch (e2) {
            return null;
        }
    }
}

const localIp = getLocalIp();
const localUrl = `http://localhost:${port}`;
const mobileUrl = `http://${localIp}:${port}`;
const kitchenUrl = `http://${localIp}:${port}/kitchen/`;

// ANSI color codes
const bold = '\x1b[1m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const amber = '\x1b[33m';
const reset = '\x1b[0m';
const dim = '\x1b[2m';

console.log('\n' + bold + cyan + '┌─────────────────────────────────────────────────────────────┐' + reset);
console.log(bold + cyan + '│' + reset + bold + '  🌐  Serving bilalabbasi.github.io                          ' + bold + cyan + '│' + reset);
console.log(bold + cyan + '├─────────────────────────────────────────────────────────────┤' + reset);
console.log(bold + cyan + '│' + reset + `  Local URL:    ${green}${localUrl.padEnd(43)}${reset}` + bold + cyan + '│' + reset);
console.log(bold + cyan + '│' + reset + `  Mobile / LAN: ${amber}${mobileUrl.padEnd(43)}${reset}` + bold + cyan + '│' + reset);
console.log(bold + cyan + '│' + reset + `  Kitchen WIP:  ${cyan}${kitchenUrl.padEnd(43)}${reset}` + bold + cyan + '│' + reset);
console.log(bold + cyan + '├─────────────────────────────────────────────────────────────┤' + reset);
console.log(bold + cyan + '│' + reset + dim + '  📱 Point your phone camera at the QR code below:          ' + reset + bold + cyan + '│' + reset);
console.log(bold + cyan + '└─────────────────────────────────────────────────────────────┘' + reset + '\n');

const qr = renderQrCode(mobileUrl);
if (qr) {
    console.log(qr);
} else {
    console.log(dim + '  (QR code tool unavailable, use the Mobile URL directly)' + reset + '\n');
}

console.log(dim + 'Press Ctrl+C to stop the server.\n' + reset);

// Start HTTP static server (binds 0.0.0.0 to match GitHub Pages directory resolution)
const serveProcess = spawn('python3', ['-m', 'http.server', port, '--bind', '0.0.0.0'], {
    cwd: rootDir,
    stdio: 'inherit'
});

serveProcess.on('error', (err) => {
    console.error('Failed to start server:', err.message);
});

process.on('SIGINT', () => {
    serveProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    serveProcess.kill('SIGTERM');
    process.exit(0);
});
