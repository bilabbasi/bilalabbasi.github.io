#!/usr/bin/env node

/**
 * Dev Server with Mobile QR Code Scanner & Tailscale Integration
 * 
 * Usage:
 *   node serve.js
 *   ./serve.sh
 *   ./serve.js [port]
 * 
 * Binds to 0.0.0.0 so both local browser and mobile devices can access the site.
 * Prioritizes Tailscale IP when available for cross-network access across your tailnet,
 * falling back to local Wi-Fi / Ethernet LAN.
 * Prints a scannable terminal QR code for your phone.
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

// Detect Tailscale IP address (CLI or virtual interface in 100.64.0.0/10 CGNAT range)
function getTailscaleIp() {
    // 1. Try checking tailscale CLI directly
    try {
        const out = execSync('tailscale ip -4', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 1000 }).trim();
        if (out && /^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\.\d+$/.test(out)) {
            return out;
        }
    } catch (_) {}

    // 2. Try macOS app binary path if CLI is not in standard PATH
    try {
        const out = execSync('/Applications/Tailscale.app/Contents/MacOS/Tailscale ip -4', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 1000 }).trim();
        if (out && /^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\.\d+$/.test(out)) {
            return out;
        }
    } catch (_) {}

    // 3. Inspect network interfaces for Tailscale CGNAT subnet (100.64.0.0/10) or interface name
    const interfaces = os.networkInterfaces();
    for (const [name, addrs] of Object.entries(interfaces)) {
        for (const addr of addrs) {
            if (addr.family === 'IPv4' && !addr.internal) {
                const isTailscaleCgnat = /^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./.test(addr.address);
                const isTailscaleName = /tailscale/i.test(name);
                if (isTailscaleCgnat || isTailscaleName) {
                    return addr.address;
                }
            }
        }
    }

    return null;
}

// Detect the best local LAN IP address (Wi-Fi / Ethernet)
function getLanIp() {
    const interfaces = os.networkInterfaces();
    const candidates = [];

    for (const [name, addrs] of Object.entries(interfaces)) {
        for (const addr of addrs) {
            if (addr.family === 'IPv4' && !addr.internal) {
                // Ignore Tailscale CGNAT addresses when finding physical LAN IP
                if (/^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./.test(addr.address)) continue;
                if (/tailscale/i.test(name)) continue;

                let score = 0;
                if (/^(en|eth|wlan)/i.test(name)) score += 10;
                if (/^192\.168\./.test(addr.address)) score += 5;
                else if (/^10\./.test(addr.address)) score += 4;
                else if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(addr.address)) score += 3;
                if (/^utun|^docker|^vbox/i.test(name)) score -= 20;

                candidates.push({ name, ip: addr.address, score });
            }
        }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.length > 0 ? candidates[0].ip : null;
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

// 1. Check for Tailscale IP first
const tailscaleIp = getTailscaleIp();
const lanIp = getLanIp();
const isTailscale = Boolean(tailscaleIp);
const selectedIp = tailscaleIp || lanIp || 'localhost';

const localUrl = `http://localhost:${port}`;
const mobileUrl = `http://${selectedIp}:${port}`;
const kitchenUrl = `http://${selectedIp}:${port}/kitchen/`;

// ANSI color codes
const bold = '\x1b[1m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const amber = '\x1b[33m';
const magenta = '\x1b[35m';
const reset = '\x1b[0m';
const dim = '\x1b[2m';

function boxRow(text) {
    const plain = text.replace(/\x1b\[[0-9;]*m/g, '');
    const pad = Math.max(0, 59 - plain.length);
    return bold + cyan + '│ ' + reset + text + ' '.repeat(pad) + bold + cyan + ' │' + reset;
}

// Explicit awareness message in console
console.log('');
if (isTailscale) {
    console.log(bold + green + '⚡ Tailscale IP Detected: ' + reset + `${bold}${tailscaleIp}${reset}` + dim + ' (Using Tailscale for remote & mobile access)' + reset);
    if (lanIp) {
        console.log(dim + `   Local LAN IP (${lanIp}) also available on same Wi-Fi.` + reset);
    }
} else {
    console.log(dim + `ℹ️  No Tailscale IP detected; using local Wi-Fi / LAN IP (${selectedIp}).` + reset);
}

console.log('\n' + bold + cyan + '┌─────────────────────────────────────────────────────────────┐' + reset);
console.log(boxRow(bold + ' 🌐  Serving bilalabbasi.github.io' + reset));
console.log(bold + cyan + '├─────────────────────────────────────────────────────────────┤' + reset);
console.log(boxRow(` Local URL:    ${green}${localUrl}${reset}`));
if (isTailscale) {
    console.log(boxRow(` Tailscale:    ${amber}${mobileUrl}${reset}`));
    if (lanIp) {
        console.log(boxRow(` Local Wi-Fi:  ${dim}http://${lanIp}:${port}${reset}`));
    }
} else {
    console.log(boxRow(` Mobile / LAN: ${amber}${mobileUrl}${reset}`));
}
console.log(boxRow(` Kitchen WIP:  ${cyan}${kitchenUrl}${reset}`));
console.log(bold + cyan + '├─────────────────────────────────────────────────────────────┤' + reset);
if (isTailscale) {
    console.log(boxRow(bold + magenta + ' 🔒 Tailscale Mode: ' + reset + 'Accessible anywhere across your tailnet'));
}
console.log(boxRow(dim + ' 📱 Point your phone camera at the QR code below:' + reset));
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
