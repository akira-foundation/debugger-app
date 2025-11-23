# Akira Debugger - Feature Roadmap

## Overview
This document tracks all planned features and enhancements for the Akira Debugger application.

---

## Feature Ideas

### 1. Log Type Filtering
**Status:** Pending
**Complexity:** Easy
**Description:** Add filter buttons in the header to filter logs by type (error, warning, info, debug, executed_query, eloquent_model, mailable)
**Benefits:** Developers can focus on specific log types instead of all logs at once
**Implementation Notes:**
- Add type filter buttons in Header component next to color filters
- Update LogList to filter by selected types
- Persist selected types in state

---

### 2. Persistent Log Storage
**Status:** Pending
**Complexity:** Medium
**Description:** Add SQLite backend to store logs on disk, allowing logs to persist across app restarts
**Benefits:**
- Keep logs between app restarts
- Search historical logs from days/weeks ago
- Configurable retention policies
- Better performance with large log volumes

**Implementation Notes:**
- Add SQLite dependency via Tauri
- Create database schema for logs table
- Migrate in-memory log storage to SQLite
- Add log retention policy configuration
- Update log clearing to work with database

---

### 3. Error Stack Trace Viewer
**Status:** Pending
**Complexity:** Medium
**Description:** Display properly formatted stack traces with clickable file links for error logs
**Benefits:**
- Easier debugging of exceptions
- Quick navigation to error source
- Better readability than flat text display

**Implementation Notes:**
- Create StackTraceViewer component
- Parse error content for stack trace patterns
- Add clickable file links (open_in_editor command)
- Format with proper indentation and syntax highlighting

---

### 4. Query Performance Analysis
**Status:** Pending
**Complexity:** Medium
**Description:** Add analysis features for executed_query logs including slow query detection and frequency tracking
**Benefits:**
- Identify slow queries immediately
- See which queries run most frequently
- Optimize database performance
- Database connection pooling insights

**Implementation Notes:**
- Extend ExecutedQueryDisplay component
- Add threshold for "slow" queries (e.g., > 100ms)
- Track query frequency and show duplicate count
- Add query categorization (SELECT, INSERT, UPDATE, DELETE)
- Create visual indicators for slow queries

---

### 5. Log Grouping & Aggregation
**Status:** Pending
**Complexity:** Medium
**Description:** Group identical or similar logs together to show patterns and reduce noise
**Benefits:**
- "This error occurred 47 times from UserService.php:123"
- See first and last occurrence timestamps
- Collapse duplicates to reduce screen clutter
- Identify problematic areas quickly

**Implementation Notes:**
- Create log grouping logic (by file, type, message content)
- Add grouping toggle button in header
- Show occurrence count and timestamps for each group
- Update LogList to display groups instead of individual logs

---

### 6. Advanced Search/Filter UI
**Status:** Pending
**Complexity:** Medium
**Description:** Build advanced search and filter builder beyond simple text matching
**Benefits:**
- More powerful searching (file, type, color, time range, etc.)
- Save filter presets for repeated use
- Regex support for complex patterns
- Search history for quick access

**Implementation Notes:**
- Create FilterBuilder component with multiple criteria
- Add preset save/load functionality
- Implement regex pattern matching in search
- Track search history
- Add to SearchBar or create separate FilterPanel

---

### 7. Performance Timeline
**Status:** Pending
**Complexity:** Hard
**Description:** Create a waterfall/timeline visualization showing logs with their execution times
**Benefits:**
- Visually identify bottlenecks
- See parallel vs sequential execution
- Easy performance optimization
- Better understand request flow

**Implementation Notes:**
- Use library like Recharts or custom SVG timeline
- Calculate execution time from log timestamps
- Create waterfall layout showing dependencies
- Add zoom and pan controls
- Show total request time

---

### 8. Log Snapshots & Breakpoints
**Status:** Pending
**Complexity:** Hard
**Description:** Allow conditional breakpoints and state snapshots at specific execution points
**Benefits:**
- Pause app on specific log patterns
- Capture application state at key moments
- Debug complex workflows
- Replay scenarios

**Implementation Notes:**
- Add breakpoint configuration modal
- Implement condition matching logic
- Add pause functionality to server
- Store snapshots in persistent storage
- Create snapshot viewer/comparator

---

### 9. Export to Logging Services
**Status:** Pending
**Complexity:** Medium
**Description:** Send logs to external services for aggregation and analysis
**Benefits:**
- Centralize logs from multiple environments
- Use professional error tracking (Sentry)
- Team notifications (Slack, Discord)
- Long-term log archival

**Implementation Notes:**
- Create exporters for Sentry, Slack, Discord
- Add configuration UI in settings
- Bulk export selected logs
- Export on-demand to multiple services
- Handle API authentication and rate limiting

---

### 10. Dark/Light Theme Toggle
**Status:** Pending
**Complexity:** Easy
**Description:** Add theme switcher for dark and light modes beyond current Dracula theme
**Benefits:**
- Better user experience based on preference
- Reduced eye strain in different lighting
- Professional appearance options

**Implementation Notes:**
- Create theme provider context
- Add light theme Tailwind configuration
- Create theme toggle button in settings or header
- Persist theme preference
- Update all components to respect theme

---

### 11. AI Log Explanation
**Status:** Pending
**Complexity:** Medium
**Description:** Integrate AI to analyze and explain logs in natural language, helping developers understand what happened
**Benefits:**
- Quick understanding of errors and issues
- Save time debugging complex logs
- Educational - learn best practices
- Works with any log type (errors, warnings, queries, etc.)

**Implementation Notes:**
- Create LogExplainer component with "Explain with AI" button
- Integrate with Claude API (or similar AI provider)
- Send log content to AI for analysis
- Display explanation in a modal or expandable section
- Cache explanations to avoid duplicate API calls
- Add configuration for AI provider and API key in settings
- Show loading state while AI analyzes
- Handle API rate limits and errors gracefully
- Support explaining single logs or multiple selected logs
- Add option to adjust explanation detail level (brief, detailed, technical)

---

## Implementation Priority

### Phase 1 (Quick Wins - Easy)
- [ ] Log Type Filtering
- [ ] Dark/Light Theme Toggle

### Phase 2 (High Impact - Medium) ⭐ START HERE
- [ ] **AI Log Explanation** ⭐ NEW - Explain logs with AI
- [ ] Persistent Log Storage
- [ ] Query Performance Analysis
- [ ] Advanced Search/Filter UI
- [ ] Export to Logging Services

### Phase 3 (Advanced - Hard)
- [ ] Error Stack Trace Viewer
- [ ] Log Grouping & Aggregation
- [ ] Performance Timeline
- [ ] Log Snapshots & Breakpoints

---

## Progress Tracking

| Feature | Status | Started | Completed | Notes |
|---------|--------|---------|-----------|-------|
| Remove Unused ColorFilter | ✅ Completed | - | 2025-11-23 | Cleaned up unused component |
| Log Type Filtering | ✅ Completed | - | 2025-11-23 | Added Log, Model, Query, Mail type filters in header |
| AI Log Explanation | ⏳ Pending | - | - | NEW - Priority feature |
| Persistent Log Storage | ⏳ Pending | - | - | - |
| Error Stack Trace Viewer | ⏳ Pending | - | - | - |
| Query Performance Analysis | ⏳ Pending | - | - | - |
| Log Grouping & Aggregation | ⏳ Pending | - | - | - |
| Advanced Search/Filter UI | ⏳ Pending | - | - | - |
| Performance Timeline | ⏳ Pending | - | - | - |
| Log Snapshots & Breakpoints | ⏳ Pending | - | - | - |
| Export to Logging Services | ⏳ Pending | - | - | - |
| Dark/Light Theme Toggle | ⏳ Pending | - | - | - |

---

## AI Log Explanation - Implementation Plan

### Architecture Overview
Integrate AI (Claude API) to analyze and explain logs in natural language.

### Components to Create
1. **src/services/aiService.ts** - Service for Claude API communication
2. **src-tauri/src/commands/ai.rs** - Tauri command for secure API calls
3. **src/components/AIExplanationButton.tsx** - Button to trigger explanation
4. **src/components/AIExplanationModal.tsx** - Modal to display AI response
5. **src/hooks/useLogExplanation.ts** - Hook for explanation state management

### Component Modifications
1. **src/components/LogEntry.tsx** - Add explanation button and modal
2. **src/components/SettingsModal.tsx** - Add API key configuration
3. **src/types/index.ts** - Add AI explanation types

### Implementation Steps
- [ ] Create aiService.ts with explainLog() function
- [ ] Create ai.rs Tauri command for secure API handling
- [ ] Create AIExplanationButton component
- [ ] Create AIExplanationModal component
- [ ] Create useLogExplanation hook
- [ ] Integrate into LogEntry.tsx
- [ ] Add API key configuration to SettingsModal
- [ ] Add error handling and loading states
- [ ] Add explanation caching
- [ ] Test with Claude API

### Configuration Needed
- Claude API Key storage in settings
- Tauri-secure-storage for API key encryption
- Rate limiting configuration
- Explanation detail level selector (brief/detailed/technical)

### UI/UX Details
- Show "Explain with AI" button on log hover
- Loading spinner during API call
- Cache explanations to avoid duplicate calls
- Show error message if API fails
- Allow selecting detail level before generating explanation
- Option to regenerate explanation

---

---

## Additional Feature Ideas (From Codebase Analysis)

### Easy Wins (Quick Implementation)
1. **Remove Unused ColorFilter Component** - ColorFilter.tsx is not used anywhere
2. **Log Type Filter Buttons** - Add error/warning/info/debug type buttons in header
3. **Expand All / Collapse All Buttons** - Bulk expand/collapse all logs
4. **Light Theme Toggle** - Add light theme option (currently Dracula only)
5. **Consolidate Export Logic** - Unify export between SearchBar and Footer
6. **Cross-Platform Editor Support** - Support VSCode, Sublime, Vim (not just PhpStorm)
7. **Jump to Next/Prev Error** - Navigation buttons for errors and warnings
8. **Keyboard Shortcuts Documentation** - Document Cmd+L, Cmd+F and add more

### Medium Complexity Features
1. **Error Stack Trace Parser** - Format and make stack traces clickable
2. **Query Performance Dashboard** - Slow query highlighting and frequency tracking
3. **Log Grouping by File/Type** - Group identical logs together
4. **Memory Trend Visualization** - Show memory usage over time (currently only snapshot)
5. **Search History** - Remember recent searches
6. **Filter Presets** - Save and reuse common filters
7. **Regex Search Support** - Advanced pattern matching
8. **Log Type Badges** - Visual icons for log types (not just color labels)
9. **Remember Expansion State** - Keep log expand/collapse state across sessions
10. **Font Size Adjustment** - Allow users to increase/decrease log text size

### Advanced Features
1. **Performance Timeline/Waterfall** - Visual execution flow of logs
2. **State Snapshots & Replay** - Capture and replay app state at log points
3. **Conditional Breakpoints** - Pause when log pattern matches
4. **Dependency Tracing** - Show service/dependency flow
5. **Event Causality Tracking** - Show cause-effect between logs
6. **Sentry Integration** - Send errors to Sentry
7. **Slack/Discord Notifications** - Alert team on errors
8. **Log Annotations** - Add notes and comments to logs
9. **Profiler Integration** - Visualize CPU/memory profiler output
10. **Flame Graphs** - Display performance analysis as flame graphs

### Architecture Improvements
1. **Log Virtualization** - Better performance with 1000+ logs
2. **Persistent Storage** - SQLite backend for logs
3. **Settings Encryption** - Secure API keys in local storage
4. **Error Boundaries** - Handle component crashes gracefully
5. **Request Retry Logic** - Auto-retry failed Tauri commands
6. **Offline Queue** - Queue exports when offline
7. **Input Validation** - Validate file paths before opening in editor
8. **Loading States** - Show spinners for async operations
9. **Test Coverage** - Add unit and integration tests
10. **Configuration File** - Support .akira.json config

### Unused/Incomplete Code to Fix
1. **SearchBar.tsx export()** - Uses localStorage instead of Tauri command
2. **Memory detection** - Only works on macOS, returns 0 on Windows/Linux
3. **Settings infrastructure** - Only handles licenses, not general app settings
4. **Type definitions** - Missing `search_keywords`, `severity`, `tags`, `metadata` fields
5. **Error handling** - Silent failures with console.error only

---

## Notes
- All features should maintain backward compatibility
- Follow existing code patterns and architecture
- Add TypeScript types for all new code
- Test on macOS, Linux, and Windows
