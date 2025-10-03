# Biometric Device API Documentation

## Overview
This API allows biometric devices to integrate with the DAG Industries Attendance Monitoring System.

## Base URL
\`\`\`
https://your-domain.com/api/biometric
\`\`\`

## Authentication
All requests must include the device credentials in the request body:
- `device_id`: Unique device identifier
- `api_key`: Device API key (generated during device registration)

## Endpoints

### 1. Verify Device
Verify device credentials and check connectivity.

**Endpoint:** `POST /api/biometric/verify`

**Request Body:**
\`\`\`json
{
  "device_id": "BIO-001",
  "api_key": "your-api-key-here"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "device": {
    "id": "uuid",
    "device_id": "BIO-001",
    "name": "Main Entrance Scanner",
    "location": "Building A - Main Entrance",
    "status": "active"
  }
}
\`\`\`

**Response (Error):**
\`\`\`json
{
  "error": "Invalid device credentials"
}
\`\`\`

### 2. Record Attendance (Check-In/Check-Out)
Record employee check-in or check-out via biometric scan.

**Endpoint:** `POST /api/biometric/check-in`

**Request Body:**
\`\`\`json
{
  "device_id": "BIO-001",
  "employee_id": "EMP001",
  "action": "check-in",
  "biometric_data": "optional-fingerprint-hash"
}
\`\`\`

**Parameters:**
- `device_id` (required): Device identifier
- `employee_id` (required): Employee ID number
- `action` (required): Either "check-in" or "check-out"
- `biometric_data` (optional): Encrypted biometric data for verification

**Response (Success - Check-In):**
\`\`\`json
{
  "success": true,
  "message": "Check-in successful",
  "employee": {
    "name": "John Doe",
    "employee_id": "EMP001"
  },
  "attendance": {
    "id": "uuid",
    "check_in_time": "2025-02-10T08:30:00Z",
    "status": "present"
  }
}
\`\`\`

**Response (Success - Check-Out):**
\`\`\`json
{
  "success": true,
  "message": "Check-out successful",
  "employee": {
    "name": "John Doe",
    "employee_id": "EMP001"
  },
  "attendance": {
    "id": "uuid",
    "check_in_time": "2025-02-10T08:30:00Z",
    "check_out_time": "2025-02-10T17:30:00Z",
    "status": "present"
  }
}
\`\`\`

**Response (Error):**
\`\`\`json
{
  "error": "Already checked in today"
}
\`\`\`

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing or invalid parameters |
| 403 | Forbidden - Invalid device credentials |
| 404 | Not Found - Employee not found |
| 500 | Internal Server Error |

## Integration Example

### Python Example
\`\`\`python
import requests
import json

API_BASE_URL = "https://your-domain.com/api/biometric"
DEVICE_ID = "BIO-001"
API_KEY = "your-api-key-here"

def verify_device():
    response = requests.post(
        f"{API_BASE_URL}/verify",
        json={
            "device_id": DEVICE_ID,
            "api_key": API_KEY
        }
    )
    return response.json()

def record_attendance(employee_id, action):
    response = requests.post(
        f"{API_BASE_URL}/check-in",
        json={
            "device_id": DEVICE_ID,
            "employee_id": employee_id,
            "action": action
        }
    )
    return response.json()

# Verify device on startup
device_info = verify_device()
print(f"Device verified: {device_info}")

# Record check-in
result = record_attendance("EMP001", "check-in")
print(f"Check-in result: {result}")
\`\`\`

### JavaScript/Node.js Example
\`\`\`javascript
const API_BASE_URL = "https://your-domain.com/api/biometric";
const DEVICE_ID = "BIO-001";
const API_KEY = "your-api-key-here";

async function verifyDevice() {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_id: DEVICE_ID,
      api_key: API_KEY
    })
  });
  return response.json();
}

async function recordAttendance(employeeId, action) {
  const response = await fetch(`${API_BASE_URL}/check-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_id: DEVICE_ID,
      employee_id: employeeId,
      action: action
    })
  });
  return response.json();
}

// Usage
verifyDevice().then(console.log);
recordAttendance("EMP001", "check-in").then(console.log);
\`\`\`

## Security Notes

1. **API Keys**: Store device API keys securely. Never expose them in client-side code.
2. **HTTPS**: Always use HTTPS in production to encrypt data in transit.
3. **Rate Limiting**: The API implements rate limiting to prevent abuse.
4. **Biometric Data**: Biometric data should be hashed/encrypted before transmission.
5. **Device Registration**: Devices must be registered in the admin dashboard before use.

## Support

For technical support or questions about the API, contact the IT department at DAG Industries.
\`\`\`

```tsx file="" isHidden
