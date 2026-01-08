# JSON and Non-JSON Response Handling

## Overview
Both the `testPing` function (in `addEndpoint.tsx`) and the `pingEndpoint` function (in `pingActions.ts`) have been enhanced to properly handle both JSON and non-JSON responses.

## Implementation Details

### 1. Test Ping Function (`addEndpoint.tsx`)

**Previous Issues:**
- Only attempted to parse responses as JSON
- Would throw errors for non-JSON responses (HTML, plain text, XML, etc.)
- Poor error handling and user feedback

**New Implementation:**
```typescript
const testPing = async () => {
    // ... setup code ...
    
    const response = await fetch(newEndpoint.url, {
        method: newEndpoint.method,
    });
    
    if (!response.ok) {
        toast.error(`Request failed with status ${response.status}`);
        setTestResponse(`Error: ${response.status} ${response.statusText}`);
        return;
    }

    // Get the response text first
    const text = await response.text();
    
    // Try to parse as JSON
    try {
        const data = JSON.parse(text);
        setTestResponse(JSON.stringify(data, null, 2)); // Pretty-printed JSON
    } catch (jsonError) {
        // Not JSON, display as plain text
        setTestResponse(text || "(Empty response)");
    }
}
```

**Benefits:**
- ✅ Handles JSON responses with pretty-printing
- ✅ Handles HTML responses (e.g., from web servers)
- ✅ Handles plain text responses
- ✅ Handles XML responses
- ✅ Handles empty responses
- ✅ Better error messages with status codes
- ✅ Improved user feedback via toasts

### 2. Ping Endpoint Function (`pingActions.ts`)

**Previous Implementation:**
- Already read response as text (good!)
- But didn't attempt to normalize JSON

**Enhanced Implementation:**
```typescript
// Read response body (limit to 500 chars for storage)
const text = await response.text();

// Try to parse and re-stringify JSON for consistent formatting
try {
    const parsed = JSON.parse(text);
    responseBody = JSON.stringify(parsed).slice(0, 500);
} catch {
    // Not JSON, store as plain text
    responseBody = text.slice(0, 500);
}
```

**Benefits:**
- ✅ Normalizes JSON responses (removes extra whitespace)
- ✅ Stores non-JSON responses as-is
- ✅ Consistent storage format in database
- ✅ Handles all content types gracefully
- ✅ No errors thrown for non-JSON content

## Response Type Examples

### JSON Response
```json
{
  "status": "healthy",
  "uptime": 12345,
  "version": "1.0.0"
}
```
**Stored as:** Compact JSON string (normalized)

### HTML Response
```html
<!DOCTYPE html>
<html>
  <head><title>Status Page</title></head>
  <body>OK</body>
</html>
```
**Stored as:** Plain text (first 500 chars)

### Plain Text Response
```
OK
```
**Stored as:** Plain text

### XML Response
```xml
<?xml version="1.0"?>
<status>healthy</status>
```
**Stored as:** Plain text (first 500 chars)

### Empty Response
```
(Empty body)
```
**Stored as:** Empty string or null

## Error Handling

### Network Errors
- DNS failures
- Connection refused
- Timeouts
- TLS errors

**Handling:** Error message stored in `errorMessage` field, `responseMessage` is null

### HTTP Errors (4xx, 5xx)
- 404 Not Found
- 500 Internal Server Error
- 503 Service Unavailable

**Handling:** Response body (if any) stored in `responseMessage`, status code in `statusCode`

### Malformed JSON
If a server returns `Content-Type: application/json` but the body is invalid JSON:
- **Test Ping:** Displays the raw text to the user
- **Ping Endpoint:** Stores the raw text in the database

## Database Storage

### PingLog Schema
```typescript
{
    responseMessage: string | null,  // Response body (JSON or text, max 500 chars)
    errorMessage: string | null,     // Error message if request failed
    statusCode: number | null,       // HTTP status code
    status: PingLog['status'],       // OK, TIMEOUT, DNS, etc.
    latencyMs: number | null,        // Response time in ms
    // ... other fields
}
```

### Storage Examples

**Successful JSON Response:**
```typescript
{
    responseMessage: '{"status":"healthy","uptime":12345}',
    errorMessage: null,
    statusCode: 200,
    status: "OK",
    latencyMs: 145
}
```

**Successful HTML Response:**
```typescript
{
    responseMessage: '<!DOCTYPE html><html><head><title>OK</title>...',
    errorMessage: null,
    statusCode: 200,
    status: "OK",
    latencyMs: 89
}
```

**Failed Request (DNS):**
```typescript
{
    responseMessage: null,
    errorMessage: "getaddrinfo ENOTFOUND invalid.domain",
    statusCode: null,
    status: "DNS",
    latencyMs: null
}
```

**Failed Request (500 Error with body):**
```typescript
{
    responseMessage: '{"error":"Internal Server Error","message":"Database connection failed"}',
    errorMessage: null,
    statusCode: 500,
    status: "HTTP_5XX",
    latencyMs: 234
}
```

## Best Practices

1. **Always read as text first:** Use `response.text()` instead of `response.json()` to avoid errors
2. **Try-catch for JSON parsing:** Gracefully handle non-JSON responses
3. **Limit storage size:** Store only first 500 characters to prevent database bloat
4. **Normalize JSON:** Re-stringify parsed JSON for consistent formatting
5. **Preserve raw text:** For non-JSON, store exactly what was received
6. **User feedback:** Show appropriate error messages in the UI

## Testing Scenarios

### Test These Endpoint Types:
1. ✅ REST API returning JSON
2. ✅ Web server returning HTML
3. ✅ Health check returning plain "OK"
4. ✅ SOAP API returning XML
5. ✅ Endpoint returning empty body
6. ✅ Endpoint with malformed JSON
7. ✅ Non-existent domain (DNS error)
8. ✅ Refused connection
9. ✅ Slow endpoint (timeout)
10. ✅ 404 error page

All of these should now be handled gracefully without errors!
