# Akira Debugger

Real-time desktop app for Laravel Ray logs, built with Tauri + React.

## Features

- 🛰️ Listen to Laravel Ray logs in real-time
- 🎨 Beautiful, modern UI
- 🔍 JSON payload inspection
- 📝 Log filtering and searching
- 💾 Log history (last 100 entries)

## Development

### Prerequisites

- Node.js 16+
- Rust 1.70+
- Xcode Command Line Tools (macOS)

### Setup

```bash
npm install
```

### Development

```bash
npm run tauri-dev
```

### Build

```bash
npm run tauri-build
```

## Configuration

Make sure your Laravel app is configured to send Ray logs to `127.0.0.1:23517`.

In `config/ray.php`:

```php
'host' => env('RAY_HOST', 'localhost'),
'port' => env('RAY_PORT', 23517),
'always_send_raw_values' => true,
```

## License

MIT
