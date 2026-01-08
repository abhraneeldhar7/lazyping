# Ping System Implementation Summary

## Overview
The ping system has been polished to implement comprehensive endpoint monitoring with intelligent status determination, flapping prevention, and alerting capabilities.

## Key Features Implemented

### 1. Status Determination

#### PingLog Status (Granular)
The system tracks detailed ping results:
- **OK**: HTTP 200-299
- **TIMEOUT**: Request exceeded 10 seconds
- **DNS**: DNS resolution failed
- **CONN_REFUSED**: Connection refused
- **TLS**: SSL/TLS handshake failed
- **RATE_LIMITED**: HTTP 429
- **HTTP_4XX**: Client errors (400-499)
- **HTTP_5XX**: Server errors (500+)
- **UNKNOWN**: Unclassified errors

#### Endpoint Status (High-Level)
Endpoints are classified into three states:
- **UP**: HTTP 200-299 AND latency < 2000ms
- **DEGRADED**: HTTP 200-299 BUT latency >= 2000ms
- **DOWN**: Any error status OR timeout

### 2. Two-Strike Rule (Flapping Prevention)

The system prevents status flapping by requiring **2 consecutive failures** before marking an endpoint as DOWN:

**On Failure:**
- Increment `consecutiveFailures` counter
- If `consecutiveFailures >= 2`: Change status to DOWN and trigger alert
- If `consecutiveFailures = 1`: Keep previous status (or DEGRADED if no previous status)

**On Success:**
- Reset `consecutiveFailures` to 0
- Update status to UP or DEGRADED based on latency

### 3. Alerting Logic

#### DOWN Alert
- Triggered ONLY when `consecutiveFailures` hits exactly 2
- Not triggered on subsequent failures (3, 4, 5...)
- Prevents alert spam

#### RECOVERY Alert
- Triggered ONLY when:
  - Previous status was DOWN, AND
  - Current result is UP or DEGRADED

#### Implementation
```typescript
async function alertGithubIssue(endpoint: EndpointType, type: "DOWN" | "RECOVERED") {
    // TODO: Implement GitHub issue creation via API
}
```

### 4. Configuration Thresholds

```typescript
const LATENCY_DEGRADED_THRESHOLD = 2000; // ms
const CONSECUTIVE_FAILURES_THRESHOLD = 2;
const TIMEOUT_MS = 10000; // 10 seconds
```

## Frontend Status Pills

### Endpoint Status Display
The UI now supports 4 distinct endpoint states:

1. **Active (UP)** - Green (#00ff9e)
   - Icon: CheckIcon
   - Indicates healthy endpoint with good latency

2. **Degraded** - Orange (#ffa500)
   - Icon: OctagonAlert
   - Indicates endpoint is responding but with high latency (>2s)

3. **Down** - Red (#ed0707)
   - Icon: XIcon
   - Indicates endpoint is not responding or returning errors

4. **Maintenance** - Blue (#3b82f6)
   - Icon: PauseIcon
   - Reserved for manual maintenance mode (future feature)

### Log Status Display (Dashboard)
The dashboard displays logs with:
- **OK logs**: Green background with status code (e.g., "200 ok")
- **Error logs**: Red background with error type (e.g., "TIMEOUT", "DNS", "HTTP_5XX")

## Database Operations

### 1. Log Creation
Every ping creates a `PingLog` entry with:
- Timestamp
- Latency (null for timeouts)
- Status (granular)
- Status code
- Response/error messages
- Human-readable summary

### 2. Endpoint Update
Updates the endpoint document with:
- `currentStatus` (UP/DEGRADED/DOWN)
- `latency`
- `lastPingedAt`
- `nextPingAt`
- `consecutiveFailures`
- `lastStatusChange` (only if status changed)

### 3. Project Status Calculation
When an endpoint status changes, recalculates project status:
- **OPERATIONAL**: All endpoints UP
- **DEGRADED**: Some endpoints DEGRADED, none DOWN
- **PARTIAL_OUTAGE**: Some endpoints DOWN
- **MAJOR_OUTAGE**: All endpoints DOWN

## Error Handling

### Network Errors
- DNS failures: `ENOTFOUND`
- Connection refused: `ECONNREFUSED`
- TLS errors: Certificate validation failures

### HTTP Errors
- 4xx errors: Client-side issues
- 5xx errors: Server-side issues
- 429: Rate limiting

### Timeouts
- Requests exceeding 10 seconds are aborted
- Latency is set to null for timeout cases

## Log Summary Examples

```
✅ GET https://api.example.com responded with 200 in 145ms
⏱️ Request timed out after 10000ms
🔍 DNS resolution failed for https://invalid.domain
🔌 Connection refused to https://localhost:9999
🔒 SSL/TLS handshake failed for https://expired.badssl.com
⚠️ Rate limit exceeded (429) for https://api.example.com
❌ Client error: 404 for https://api.example.com/notfound
💥 Server error: 500 for https://api.example.com/error
```

## Files Modified

1. **`app/actions/pingActions.ts`**
   - Complete rewrite with enhanced logic
   - Added helper functions for status determination
   - Implemented two-strike rule
   - Added alerting placeholders

2. **`app/project/[id]/page.tsx`**
   - Enhanced status pill rendering
   - Added support for DEGRADED and MAINTENANCE states

3. **`app/project/[id]/e/[endpointId]/page.tsx`**
   - Enhanced status pill rendering
   - Added missing icon imports

## Next Steps (TODO)

1. **Implement GitHub Issue Creation**
   - Use GitHub API to create issues on DOWN alerts
   - Auto-close issues on RECOVERY alerts
   - Requires GitHub App integration

2. **Add Maintenance Mode**
   - Allow users to manually set endpoints to MAINTENANCE
   - Prevent alerts during maintenance windows

3. **Enhanced Alerting**
   - Email notifications
   - Slack/Discord webhooks
   - SMS alerts for critical endpoints

4. **Historical Analytics**
   - Uptime percentage calculations
   - Latency trends
   - MTTR (Mean Time To Recovery) metrics

5. **Redis Caching**
   - Cache endpoint configurations
   - Reduce database load for high-frequency pings
