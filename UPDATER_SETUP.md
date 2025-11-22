# Auto Updater Setup

This project is configured with Tauri's auto updater. Follow the steps below to complete the setup.

## 1. Add the private key to GitHub

The private key was generated during setup. You need to add it as a secret in GitHub:

1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `TAURI_SIGNING_PRIVATE_KEY`
4. Value: Copy the generated private key (starts with `dW50cnVzdGVkIGNvbW1lbnQ6...`)

## 2. Sync the .env.example file

The `.env.example` file contains the necessary variables. For local development:

```bash
cp .env.example .env
# Edit .env with your private key (optional for dev)
```

## 3. How the auto updater works

### In the app:
- Checks for updates automatically on startup
- If a new version is available, displays a dialog to the user
- Downloads and installs the update
- Restarts the application

### In the workflow (build-and-release.yml):
1. Compiles the app on all platforms (macOS, Linux, Windows)
2. Signs the artifacts with the private key
3. Uploads to GitHub Releases
4. Creates `latest.json` file with update information

## 4. Versioning

The updater uses the version number in `src-tauri/tauri.conf.json` and the git tag (v*.*.* format).

For a release:
```bash
# Update the version in tauri.conf.json
# Commit and push
# Create a tag
git tag v0.3.4
git push origin v0.3.4
```

This will trigger the build and release workflow automatically.

## 5. Troubleshooting

If the updater doesn't work:

- Verify that the `TAURI_SIGNING_PRIVATE_KEY` secret is configured in GitHub
- Verify that the `latest.json` file was created in the release
- Check the app console for debug logs
- Verify the endpoint in `tauri.conf.json` is correct

## References

- [Tauri Updater Docs](https://tauri.app/v1/guides/distribution/updater/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
