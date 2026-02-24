

# [0.5.0](https://github.com/debugger-akira-io-com/desktop-app/compare/0.4.0...0.5.0) (2026-02-24)


### Bug Fixes

* remove macOS specific configuration from tauri settings ([1049d65](https://github.com/debugger-akira-io-com/desktop-app/commit/1049d656e683dd77f16810fec9dda96ad3754e40))
* remove quotes from URL in build-and-release.yml for consistency ([c528d22](https://github.com/debugger-akira-io-com/desktop-app/commit/c528d225441f105a4f8de4f1b2f4d100a49817bb))
* remove unnecessary build arguments for macOS in CI configuration ([e341e1b](https://github.com/debugger-akira-io-com/desktop-app/commit/e341e1b8e75e8d6b3159d07450de7da3cc49f126))
* rename test build job to clarify its purpose ([84ed001](https://github.com/debugger-akira-io-com/desktop-app/commit/84ed0011d1df9e5956bc28e9d00a5624306aa026))
* update download URLs for macOS and Linux in build configurations ([0d41086](https://github.com/debugger-akira-io-com/desktop-app/commit/0d41086763b261b37e916397ef83f179babd8a6a))
* update footer component to use APP_VERSION from version file ([98a9dfa](https://github.com/debugger-akira-io-com/desktop-app/commit/98a9dfa3d1306f85cabdfdb64aced44c5a847909))
* update S3 upload path for latest.json in test build configuration ([e3416f3](https://github.com/debugger-akira-io-com/desktop-app/commit/e3416f3da983298804d24967be0272669cedf47d))
* URL encode filename in test upload to handle spaces correctly ([642a69e](https://github.com/debugger-akira-io-com/desktop-app/commit/642a69e76cc9386a978fa745ea5f14d20243fa7b))


### Features

* add 'application_log' type to log filtering and update log types definition ([7c6ab0e](https://github.com/debugger-akira-io-com/desktop-app/commit/7c6ab0e2b5fadc9643145154d6ce7e1d66a21106))
* add border class customization to log display components ([9111618](https://github.com/debugger-akira-io-com/desktop-app/commit/911161809a0b107f241ecb393df4d847a37ee255))
* add environment variables for Digital Ocean Spaces upload authentication ([8ff74ef](https://github.com/debugger-akira-io-com/desktop-app/commit/8ff74ef1571def75b7c0b750737f9bba946d581b))
* add EventDisplay and TableDisplay components for enhanced log visualization ([56ac8b2](https://github.com/debugger-akira-io-com/desktop-app/commit/56ac8b2058c1a8c19cd985224cf8c6ad2ef7d027))
* add ExceptionDisplay component to handle exception log types ([c22d819](https://github.com/debugger-akira-io-com/desktop-app/commit/c22d819c9b6920f83b57b161ee3784a4ebd4801b))
* add functionality to expand/collapse all logs in the log display ([08b0209](https://github.com/debugger-akira-io-com/desktop-app/commit/08b020902e60c56ce1583280ffd0e8e255649224))
* add log type filtering functionality in header and log list ([c977111](https://github.com/debugger-akira-io-com/desktop-app/commit/c977111325ca14fe4a7138561d79d83ab30a7568))
* add macOS icon format to tauri configuration ([cc9c74c](https://github.com/debugger-akira-io-com/desktop-app/commit/cc9c74cb5cd29a49acd87a863df1c30224cc95b7))
* add settings page with license and editor management sections ([df06ac7](https://github.com/debugger-akira-io-com/desktop-app/commit/df06ac77cc4aa9b0dba4f99462feb71d78881d94))
* add SupportSection component and integrate support tab in SettingsPage ([5fe1953](https://github.com/debugger-akira-io-com/desktop-app/commit/5fe1953182a8b45f551ddcb26f640f03f64b272e))
* add TableDisplay component and enhance LogTypeRouter for table log handling ([b520e26](https://github.com/debugger-akira-io-com/desktop-app/commit/b520e26b2447e5931d0a54b1097029520da4ee52))
* add TableDisplay component and enhance LogTypeRouter for table log handling ([ec5fe29](https://github.com/debugger-akira-io-com/desktop-app/commit/ec5fe29fcfc1ee3052aca2846e8cf79ace76e994))
* enhance array parsing to support both numeric and string keys ([66cf0b3](https://github.com/debugger-akira-io-com/desktop-app/commit/66cf0b3c380b971870da1999640295bd0149743e))
* enhance build and release workflow with version handling and test upload ([baf8785](https://github.com/debugger-akira-io-com/desktop-app/commit/baf8785e5675c0b3dd3b670aeeb6cf40e96050ec))
* enhance EventDisplay with table view for array of objects and improved data formatting ([5817c35](https://github.com/debugger-akira-io-com/desktop-app/commit/5817c351db09aee4703e154b23a39015ad07fac0))
* enhance layout and styling of Settings components for improved user experience ([bbb42b1](https://github.com/debugger-akira-io-com/desktop-app/commit/bbb42b185d7fef865f9e64169438b45c99c8d2a8))
* enhance log display components with copy functionality and style context ([e0463f3](https://github.com/debugger-akira-io-com/desktop-app/commit/e0463f3e69931e843ed30bba6923ee66bf05612c))
* enhance log entry and mailable display components with improved layout and functionality ([53f5715](https://github.com/debugger-akira-io-com/desktop-app/commit/53f5715ded5506d8db1705d84c4dc2f76f4493d3))
* implement editor selection and management functionality ([b4630ad](https://github.com/debugger-akira-io-com/desktop-app/commit/b4630adb1a93b603c852a1d28c0e8da237e0566e))
* implement log border configuration and management section in settings ([d639b4b](https://github.com/debugger-akira-io-com/desktop-app/commit/d639b4b39a14474fbdc80168b73498966fbd06ad))
* implement log display configuration and enhance CollapsibleArray with load more functionality ([7cf8955](https://github.com/debugger-akira-io-com/desktop-app/commit/7cf895536134b365fa9200876206fcf08c88f82d))
* implement tab navigation for License and Preferences sections in SettingsPage ([4f711b7](https://github.com/debugger-akira-io-com/desktop-app/commit/4f711b7cee5772f6597b8964067e2ba73d964238))
* implement upload process for macOS and Windows artifacts to Digital Ocean Spaces ([dab36e6](https://github.com/debugger-akira-io-com/desktop-app/commit/dab36e6c346c7f393af19788b95e5f57428a781b))
* improve CollapsibleArray component with enhanced styling and button functionality ([49e9e4d](https://github.com/debugger-akira-io-com/desktop-app/commit/49e9e4dd5d3dd20bd394d91e1b192d22270625c4))
* introduce SettingsButton component and refactor button usage in various sections ([85a9f66](https://github.com/debugger-akira-io-com/desktop-app/commit/85a9f6637acc50b6376fb0839cc5438a0f49479a))
* introduce SettingsCard component and refactor sections for improved layout and styling ([516e894](https://github.com/debugger-akira-io-com/desktop-app/commit/516e894f1702487858f40589e71add5910bab5a7))
* introduce SimpleLogDisplay component for streamlined log content rendering ([a70c6c5](https://github.com/debugger-akira-io-com/desktop-app/commit/a70c6c51e905947a015ac8f77eddb7793c449904))
* refactor log display configuration to use Zustand store for state management ([b327edd](https://github.com/debugger-akira-io-com/desktop-app/commit/b327edd920296ba0c1c68f1dbb207aaddd3a0a6c))
* refactor log entry header to improve expand/collapse functionality ([79b5989](https://github.com/debugger-akira-io-com/desktop-app/commit/79b598953511f3444b9a34554d9c987880bfac97))
* refactor log entry rendering and introduce filter context for enhanced log management ([2051b14](https://github.com/debugger-akira-io-com/desktop-app/commit/2051b1416d50464694adbd467cde3d71a53c8857))
* refactor SettingsCard and SettingsPage components for improved layout and styling ([c45290e](https://github.com/debugger-akira-io-com/desktop-app/commit/c45290e6a0200ef5f1059a35769a859ddeecb2ea))
* refine layout of SettingsCard component for improved spacing and styling ([211eb18](https://github.com/debugger-akira-io-com/desktop-app/commit/211eb18c389458b44dbc00ec663dd6f97cc44bc7))
* replace text indicators with icons for expandable log entries ([37bf9b4](https://github.com/debugger-akira-io-com/desktop-app/commit/37bf9b4b8acc5816e2c5bc26649beea2ffab2486))
* sync version in Cargo.toml and update icon formats in tauri.conf.json ([d8ee863](https://github.com/debugger-akira-io-com/desktop-app/commit/d8ee863c9ef11477a3cccda3a265f81671c64553))
* update build configuration for macOS to support multiple architectures ([c6c7af6](https://github.com/debugger-akira-io-com/desktop-app/commit/c6c7af66db4255b7a14f3bf65a5b9b6e0cd92e6f))
* update macOS build configuration to use universal binaries ([048067a](https://github.com/debugger-akira-io-com/desktop-app/commit/048067ad67b2c26da8200d2c7d3a60d3448b4102))
* update SupportSection to use buttons for email actions and improve email handling ([1f8220f](https://github.com/debugger-akira-io-com/desktop-app/commit/1f8220f065d05f1c52c06aaefd2cbeda40e8274c))
* update test upload process to use AWS CLI for Digital Ocean Spaces ([14a0637](https://github.com/debugger-akira-io-com/desktop-app/commit/14a0637fe09a4513d3475ee16a3580de832da502))

# [0.4.0](https://github.com/debugger-akira-io-com/desktop-app/compare/0.3.3...0.4.0) (2025-11-22)


### Bug Fixes

* consolidate Windows ICO icon creation script in build workflows for improved readability ([ccac5c8](https://github.com/debugger-akira-io-com/desktop-app/commit/ccac5c8c633356df5523a51e47bde328f738a5e2))
* refactor icon generation script in test build workflow for improved readability ([a29a9f0](https://github.com/debugger-akira-io-com/desktop-app/commit/a29a9f07ec5a4ea3210f66e742d3439cbf4b2043))
* reorder ubuntu configuration in build workflows for consistency ([54a2202](https://github.com/debugger-akira-io-com/desktop-app/commit/54a2202740c9d52a343f1a18748624f65cc460f8))
* simplify icon generation script in build workflow for clarity ([9f33ff6](https://github.com/debugger-akira-io-com/desktop-app/commit/9f33ff69ee555b9db5d7264b63214f616b9eab11))
* specify bash shell for Windows ICO icon creation in build workflows ([eb95ec0](https://github.com/debugger-akira-io-com/desktop-app/commit/eb95ec00b3c667f0ff3edc9f860e58294280bd79))
* streamline icon directory creation in build workflows for consistency ([0f82438](https://github.com/debugger-akira-io-com/desktop-app/commit/0f82438370ccefe912b63f2c0a9ea347c01174f7))
* streamline Windows ICO icon creation in build workflows for consistency ([889284b](https://github.com/debugger-akira-io-com/desktop-app/commit/889284b003ba66205d0260241eadb375c888af3f))
* unify icon directory creation in build workflows for consistency ([d17b203](https://github.com/debugger-akira-io-com/desktop-app/commit/d17b203d474f92c36a18575c3ef116a17b81a22f))


### Features

* add test build workflow for cross-platform compatibility and icon generation ([9613034](https://github.com/debugger-akira-io-com/desktop-app/commit/961303428f94fe8c4e7fe3b50866dce3915ec088))
* add updater plugin and configure update functionality ([f2d9142](https://github.com/debugger-akira-io-com/desktop-app/commit/f2d9142d4e78f45bbb09ff52d7ae1863969183f5))
* implement auto updater functionality with release manifest creation ([e81f53e](https://github.com/debugger-akira-io-com/desktop-app/commit/e81f53e2fe37adb7c72d52df50f5974f26b76cbd))

## [0.3.3](https://github.com/debugger-akira-io-com/desktop-app/compare/0.3.2...0.3.3) (2025-11-22)


### Bug Fixes

* format build-and-release.yml for improved readability ([d61f95f](https://github.com/debugger-akira-io-com/desktop-app/commit/d61f95fe20984ce91fe55003ac6659c8292532c8))

## [0.3.2](https://github.com/debugger-akira-io-com/desktop-app/compare/0.3.1...0.3.2) (2025-11-22)


### Bug Fixes

* update build-and-release.yml for cross-platform compatibility and improve icon generation script ([754830d](https://github.com/debugger-akira-io-com/desktop-app/commit/754830d52af2a7f3a1470b64e956a226cb4b0da2))
* update icon generation for cross-platform support and add ICO format ([2257ab2](https://github.com/debugger-akira-io-com/desktop-app/commit/2257ab2ead758629cae1e5293251d7e6f9156a25))
* update icon generation for cross-platform support and add ICO format ([fe3a166](https://github.com/debugger-akira-io-com/desktop-app/commit/fe3a166c1bdb4fc9154abeeb602ee1713a1ee9c0))
* update Node.js and npm versions in .nvmrc and package.json ([5e03786](https://github.com/debugger-akira-io-com/desktop-app/commit/5e0378633cc97d2760349ec6aa2201607b4248df))

## [0.3.1](https://github.com/debugger-akira-io-com/desktop-app/compare/0.3.0...0.3.1) (2025-11-22)


### Bug Fixes

* add ImageMagick for icon conversion and update application description ([c206432](https://github.com/debugger-akira-io-com/desktop-app/commit/c2064327cc5023fb2b83c3ff77b52f14d7ace143))

# [0.3.0](https://github.com/debugger-akira-io-com/desktop-app/compare/0.2.1...0.3.0) (2025-11-22)


### Bug Fixes

* consolidate artifact upload step in release workflow for macOS, Linux, and Windows ([fb2a92b](https://github.com/debugger-akira-io-com/desktop-app/commit/fb2a92bb6e6adbd0d7560f55f64020b60ecc7ab1))
* update application icons for cross-platform support in tauri configuration ([0952ef8](https://github.com/debugger-akira-io-com/desktop-app/commit/0952ef81836ff217b9da0fa1e30ff00d419752ac))


### Features

* sync application version across configuration files and add version syncing script ([6a9248a](https://github.com/debugger-akira-io-com/desktop-app/commit/6a9248a725305a27979c7621f3cbf8a1115813ff))

## [0.2.1](https://github.com/debugger-akira-io-com/desktop-app/compare/0.2.0...0.2.1) (2025-11-22)


### Bug Fixes

* update Node.js version to 20 in CI configurations and package files ([1dd8c27](https://github.com/debugger-akira-io-com/desktop-app/commit/1dd8c27944c7bd7859dd4c30d5f2f31f4a1861fc))

# [0.2.0](https://github.com/debugger-akira-io-com/desktop-app/compare/0.1.0...0.2.0) (2025-11-22)


### Bug Fixes

* update application icon format from SVG to PNG ([1d36c44](https://github.com/debugger-akira-io-com/desktop-app/commit/1d36c44700bdf5e93e78aed7e133df8ab3ff57ae))


### Features

* add CI/CD workflows for building and releasing the application ([0b9cbf8](https://github.com/debugger-akira-io-com/desktop-app/commit/0b9cbf88984adf7280bf261364ccafa7c5fec147))
* implement trial encryption and decryption functionality ([c9d552a](https://github.com/debugger-akira-io-com/desktop-app/commit/c9d552a66b600c6bf7bdd4461d52910723ba2de2))

# Changelog


# 0.1.0 (2025-11-22)


### Features

* add "About Akira Debugger" modal and menu integration ([2bb0619](https://github.com/debugger-akira-io-com/desktop-app/commit/2bb061964e4f33e0a309dbf936560c10c9d16c4b))
* add "open in editor" functionality for log file locations ([5ea1bd4](https://github.com/debugger-akira-io-com/desktop-app/commit/5ea1bd4eb188927231f803c41c8c46175bf6620d))
* add color-coded log filtering and support for attaching labels/colors to log entries ([bfd3903](https://github.com/debugger-akira-io-com/desktop-app/commit/bfd39032d2d09d6cf8f6a14f388daf5d10b7a220))
* add displays for executed queries and mailables, enhance favicon and HTML structure ([306b6b0](https://github.com/debugger-akira-io-com/desktop-app/commit/306b6b0d9f21fbb77258c730ef2bc80821e39bce))
* add Eloquent model display and enhance log entry styling ([22eda2c](https://github.com/debugger-akira-io-com/desktop-app/commit/22eda2cdf23d342bf10f98b9ae416588b3f15e4d))
* add footer component with memory usage and log export functionality ([122910d](https://github.com/debugger-akira-io-com/desktop-app/commit/122910dadc851dbece764eb347ab0be2f10f0a8b))
* add pin/unpin window functionality and keyboard shortcut for clearing logs ([fe1b950](https://github.com/debugger-akira-io-com/desktop-app/commit/fe1b95000f4a20fd5998011702f89160649a191a))
* add search functionality to filter logs and keyboard shortcut for toggle ([99f19d8](https://github.com/debugger-akira-io-com/desktop-app/commit/99f19d88cd53eafff91aba732272f1db189b7274))
* add trial status display and copy log functionality ([bb71ff4](https://github.com/debugger-akira-io-com/desktop-app/commit/bb71ff4b49a0c0a50b9a27637f3e4db65d211a5d))
* auto-scroll `LogList` to the bottom on new logs ([f0af660](https://github.com/debugger-akira-io-com/desktop-app/commit/f0af6603168266dd376c42380fcd149845522d74))
* enhance editor integration for logs and improve file handling ([07bb1b6](https://github.com/debugger-akira-io-com/desktop-app/commit/07bb1b608085e79699109f0cecccc4a432f7686c))
* enhance UI components with improved styling and consistency ([2c60b74](https://github.com/debugger-akira-io-com/desktop-app/commit/2c60b74b7cd7798520d6a13a46d3bc00f6b4e1ee))
* implement backend license service and enhance trial management functionality ([72ef09f](https://github.com/debugger-akira-io-com/desktop-app/commit/72ef09fd7caab842e3a52b4dc0bd5c05b7d1a3de))
* implement license validation system with settings and splash screen ([92a02a2](https://github.com/debugger-akira-io-com/desktop-app/commit/92a02a25ebe39e87ebb4bdb4b6b35a147eb80e8c))
* implement log export functionality with save dialog and file writing ([06cdd8b](https://github.com/debugger-akira-io-com/desktop-app/commit/06cdd8bb4bd64f95527fd8a982440fab455371c7))
* improve log expansion logic and enhance application log parsing ([5e80423](https://github.com/debugger-akira-io-com/desktop-app/commit/5e80423d2cea3c31952e146fc3c967402000bb70))
* introduce dynamic label color styling for log entries ([3547c99](https://github.com/debugger-akira-io-com/desktop-app/commit/3547c991a46ff6a206fdb0d29d296e3f52defd8c))
* modularize components and improve log rendering efficiency ([b0e6738](https://github.com/debugger-akira-io-com/desktop-app/commit/b0e67386634f091eb990ca77e28a5b46907e8f13))
* update header title to reflect listening state ([f48c105](https://github.com/debugger-akira-io-com/desktop-app/commit/f48c1059c357d387ec3fe3847a5e3dc189f43413))
* update UI styles for improved aesthetics and consistency ([3839737](https://github.com/debugger-akira-io-com/desktop-app/commit/38397375443d56b0e77e806c474f9450e7e47625))
