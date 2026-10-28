# Byreel Studio — Backend API Specification & Requirements

> Comprehensive inventory of all backend REST endpoints and WebSocket/Queue requirements derived from a full codebase audit of `e:\motion\frontend` (Landing Page, Login, Register, Dashboard, Workspace, Studio Tools, Billing, and Settings).

---

## 1. Architectural Overview

### 1.1 Base Configuration & Environments
- **Local Development**: `http://localhost:8080` (or `http://localhost:3001` configured via `.env.local` / `NEXT_PUBLIC_API_URL`)
- **Cloud Hosted Base**: `https://motion-backend--background-ab0ec.us-east4.hosted.app`
- **Fallback Hierarchy** (Implemented in [`app/lib/api.ts`](file:///e:/motion/frontend/app/lib/api.ts)):
  1. `NEXT_PUBLIC_API_URL`
  2. Local backend server
  3. Hosted cloud backend
  4. Local Next.js API route fallback (`/api/*`)

### 1.2 Authentication & Session Flow
- **Bearer Tokens**: Transmitted in the HTTP header `Authorization: Bearer <JWT_TOKEN>`.
- **Session Cookies**: Transmitted with `credentials: "include"`. Cookies named `token` and `animagent_token` (`SameSite=Lax`, `Path=/`, `Max-Age=604800` / 7 days).
- **Google OAuth 2.0**: Implemented via popup window messaging (`window.postMessage({ type: "GOOGLE_AUTH_SUCCESS", token, user })`) with full-page redirect fallback.

### 1.3 Asynchronous Job Queue Pipeline
- Generation jobs are queued via BullMQ on the backend (queue name: `AGENTQUEUE`).
- The frontend issues an idempotent prompt submission (`POST /api/prompt`) with a client-generated `promptId`, then polls `GET /api/prompt/:promptId` every 3 seconds until status transitions to `done` or `failed`.

---

## 2. API Summary & Priority Matrix

| Category | Endpoint | Method | Priority | Frontend Source | Current Status |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Auth** | `/api/login` | `POST` | **P0** | [`app/lib/api.ts:233`](file:///e:/motion/frontend/app/lib/api.ts#L233) | Connected |
| **Auth** | `/api/register` | `POST` | **P0** | [`app/lib/api.ts:245`](file:///e:/motion/frontend/app/lib/api.ts#L245) | Connected |
| **Auth** | `/api/google/auth` | `GET` | **P0** | [`app/lib/api.ts:263`](file:///e:/motion/frontend/app/lib/api.ts#L263) | Connected |
| **Auth** | `/api/google/url` | `GET` | **P0** | [`app/lib/api.ts:258`](file:///e:/motion/frontend/app/lib/api.ts#L258) | Connected |
| **Auth** | `/api/google` | `POST` | **P0** | [`app/lib/api.ts:292`](file:///e:/motion/frontend/app/lib/api.ts#L292) | Connected |
| **Auth** | `/api/google/register` | `POST` | **P0** | [`app/lib/api.ts:298`](file:///e:/motion/frontend/app/lib/api.ts#L298) | Connected |
| **Auth** | `/api/logout` | `POST` | **P0** | [`app/lib/api.ts:304`](file:///e:/motion/frontend/app/lib/api.ts#L304) | Connected |
| **User** | `/api/user/me` | `GET` | **P0** | [`app/lib/api.ts:311`](file:///e:/motion/frontend/app/lib/api.ts#L311) | Connected |
| **User** | `/api/user/profile` | `PATCH` | **P1** | [`AccountSection.tsx:26`](file:///e:/motion/frontend/app/dashboard/components/sections/AccountSection.tsx#L26) | Simulated in UI |
| **User** | `/api/user/preferences` | `PATCH` | **P1** | [`AccountSection.tsx:128`](file:///e:/motion/frontend/app/dashboard/components/sections/AccountSection.tsx#L128) | Local state |
| **User / Billing** | `/api/user/plan` | `POST` | **P0** | [`app/lib/api.ts:316`](file:///e:/motion/frontend/app/lib/api.ts#L316) | Connected |
| **Prompt & Queue** | `/api/prompt` | `POST` | **P0** | [`app/lib/api.ts:382`](file:///e:/motion/frontend/app/lib/api.ts#L382) | Connected |
| **Prompt & Queue** | `/api/prompt/:promptId` | `GET` | **P0** | [`app/lib/api.ts:389`](file:///e:/motion/frontend/app/lib/api.ts#L389) | Connected |
| **Conversations** | `/api/conversations` | `GET` | **P1** | [`useChats.ts:31`](file:///e:/motion/frontend/app/dashboard/hooks/useChats.ts#L31) | LocalStorage fallback |
| **Conversations** | `/api/conversations` | `POST` | **P1** | [`api/conversations/route.ts`](file:///e:/motion/frontend/app/api/conversations/route.ts#L10) | Local route |
| **Conversations** | `/api/conversations/:id` | `PATCH` | **P1** | [`useChats.ts:127`](file:///e:/motion/frontend/app/dashboard/hooks/useChats.ts#L127) | LocalStorage |
| **Conversations** | `/api/conversations/:id` | `DELETE` | **P1** | [`useChats.ts:117`](file:///e:/motion/frontend/app/dashboard/hooks/useChats.ts#L117) | LocalStorage |
| **Product Launch** | `/api/launch/scan-url` | `POST` | **P1** | [`ProductLaunchSection.tsx:275`](file:///e:/motion/frontend/app/dashboard/components/sections/ProductLaunchSection.tsx#L275) | Mocked in UI |
| **Product Launch** | `/api/launch/generate` | `POST` | **P1** | [`SaasLaunchVideoPlayer.tsx`](file:///e:/motion/frontend/app/dashboard/components/sections/SaasLaunchVideoPlayer.tsx) | Procedural Canvas |
| **Media & Assets** | `/api/assets` | `GET` | **P1** | [`assets.ts:39`](file:///e:/motion/frontend/app/dashboard/lib/assets.ts#L39) | LocalStorage |
| **Media & Assets** | `/api/assets/upload` | `POST` | **P0** | [`assets.ts:66`](file:///e:/motion/frontend/app/dashboard/lib/assets.ts#L66) | Needs Blob Store |
| **Media & Assets** | `/api/assets/:id` | `DELETE` | **P1** | [`AssetsSection.tsx:70`](file:///e:/motion/frontend/app/dashboard/components/sections/AssetsSection.tsx#L70) | LocalStorage |
| **Brand Kit** | `/api/brand-kit` | `GET` | **P1** | [`brandKit.ts:53`](file:///e:/motion/frontend/app/dashboard/lib/brandKit.ts#L53) | LocalStorage |
| **Brand Kit** | `/api/brand-kit` | `PUT` | **P1** | [`brandKit.ts:66`](file:///e:/motion/frontend/app/dashboard/lib/brandKit.ts#L66) | LocalStorage |
| **Brand Kit** | `/api/brand-kit/logo` | `POST` | **P1** | [`BrandKitSection.tsx:38`](file:///e:/motion/frontend/app/dashboard/components/sections/BrandKitSection.tsx#L38) | Base64 in storage |
| **Projects** | `/api/projects` | `GET` | **P1** | [`ProjectsSection.tsx:94`](file:///e:/motion/frontend/app/dashboard/components/sections/ProjectsSection.tsx#L94) | Hybrid static/local |
| **Projects** | `/api/projects/:id` | `PATCH` | **P1** | [`ProjectsSection.tsx:90`](file:///e:/motion/frontend/app/dashboard/components/sections/ProjectsSection.tsx#L90) | UI State |
| **Projects** | `/api/projects/:id` | `DELETE` | **P1** | [`ProjectsSection.tsx:82`](file:///e:/motion/frontend/app/dashboard/components/sections/ProjectsSection.tsx#L82) | UI State |
| **Exports & Renders** | `/api/exports` | `GET` | **P1** | [`ExportsSection.tsx:31`](file:///e:/motion/frontend/app/dashboard/components/sections/ExportsSection.tsx#L31) | Static fixtures |
| **Exports & Renders** | `/api/exports` | `POST` | **P0** | [`videoActions.ts:33`](file:///e:/motion/frontend/app/dashboard/lib/videoActions.ts#L33) | Needs render job |
| **Exports & Renders** | `/api/exports/queue` | `GET` | **P1** | [`ExportsSection.tsx:83`](file:///e:/motion/frontend/app/dashboard/components/sections/ExportsSection.tsx#L83) | Simulated state |
| **Templates** | `/api/templates` | `GET` | **P2** | [`app/templates/page.tsx:35`](file:///e:/motion/frontend/app/templates/page.tsx#L35) | Static fixtures |
| **Templates** | `/api/templates/:id` | `GET` | **P2** | [`TemplatesSection.tsx`](file:///e:/motion/frontend/app/dashboard/components/sections/TemplatesSection.tsx) | Static fixtures |
| **AI B-Rolls** | `/api/brolls` | `GET` | **P2** | [`BRollsSection.tsx:33`](file:///e:/motion/frontend/app/dashboard/components/sections/BRollsSection.tsx#L33) | Static fixtures |
| **API Keys** | `/api/keys` | `GET` | **P0** | [`app/lib/api.ts:324`](file:///e:/motion/frontend/app/lib/api.ts#L324) | Connected |
| **API Keys** | `/api/keys` | `POST` | **P0** | [`app/lib/api.ts:328`](file:///e:/motion/frontend/app/lib/api.ts#L328) | Connected |
| **API Keys** | `/api/keys/:keyId` | `DELETE` | **P0** | [`app/lib/api.ts:344`](file:///e:/motion/frontend/app/lib/api.ts#L344) | Connected |
| **Webhooks** | `/api/webhooks` | `GET` | **P2** | [`IntegrationsSection.tsx:247`](file:///e:/motion/frontend/app/dashboard/components/sections/IntegrationsSection.tsx#L247) | Mock UI |
| **Webhooks** | `/api/webhooks/test` | `POST` | **P2** | [`IntegrationsSection.tsx:49`](file:///e:/motion/frontend/app/dashboard/components/sections/IntegrationsSection.tsx#L49) | Simulated delay |
| **Billing** | `/api/billing/invoices` | `GET` | **P1** | [`BillingSection.tsx:8`](file:///e:/motion/frontend/app/dashboard/components/sections/BillingSection.tsx#L8) | Static fixtures |
| **Billing** | `/api/billing/create-checkout-session` | `POST` | **P0** | [`app/billing/page.tsx:188`](file:///e:/motion/frontend/app/billing/page.tsx#L188) | Direct plan switch |
| **Motion Glyphs** | `/api/motion/char-conversion` | `POST` | **P2** | [`app/lib/api.ts:357`](file:///e:/motion/frontend/app/lib/api.ts#L357) | Connected |
| **Motion Glyphs** | `/api/motion/glyphs` | `GET` | **P2** | [`app/lib/api.ts:369`](file:///e:/motion/frontend/app/lib/api.ts#L369) | Connected |

---

## 3. Detailed Endpoint Specifications

### 3.1 Authentication & Authorization

#### 1. `POST /api/login`
- **Frontend Source**: [`app/login/page.tsx:43`](file:///e:/motion/frontend/app/login/page.tsx#L43) via [`app/context/AuthContext.tsx:184`](file:///e:/motion/frontend/app/context/AuthContext.tsx#L184)
- **Description**: Authenticates user using email and password. Sets session cookies and returns bearer token.
- **Request Body**:
```json
{
  "email": "creator@byreel.io",
  "password": "Password123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_94829104",
    "email": "creator@byreel.io",
    "username": "creator",
    "profile": {
      "displayName": "Pradum Singh",
      "firstName": "Pradum",
      "lastName": "Singh",
      "avatarUrl": "/dashboard/user-avatar.jpg",
      "company": "Byreel Studio",
      "bio": "Lead Creative Director",
      "locale": "en",
      "timezone": "UTC"
    },
    "auth": {
      "provider": "email",
      "emailVerified": true,
      "role": "user",
      "status": "active",
      "permissions": ["generate", "render", "export"]
    },
    "plan": {
      "tier": "creator",
      "status": "active",
      "billingInterval": "monthly",
      "startedAt": "2026-10-01T00:00:00.000Z",
      "currentPeriodStart": "2026-10-01T00:00:00.000Z",
      "currentPeriodEnd": "2026-11-01T00:00:00.000Z",
      "features": ["40 renders / month", "1080p FHD", "Brand Kit custom fonts & colors"]
    },
    "usage": {
      "generations": { "daily": 4, "monthly": 24, "lifetime": 120, "limit": 150 },
      "renders": { "daily": 2, "monthly": 12, "lifetime": 45, "limit": 40 },
      "apiCalls": { "daily": 0, "monthly": 0, "lifetime": 0, "limit": 100 },
      "storage": { "usedBytes": 125829120, "limitBytes": 10737418240 },
      "lastResetAt": "2026-10-01T00:00:00.000Z",
      "nextResetAt": "2026-11-01T00:00:00.000Z"
    },
    "createdAt": "2026-08-01T12:00:00.000Z",
    "lastLoginAt": "2026-10-10T08:00:00.000Z"
  }
}
```

---

#### 2. `POST /api/register`
- **Frontend Source**: [`app/register/page.tsx:61`](file:///e:/motion/frontend/app/register/page.tsx#L61) via [`AuthContext.tsx:257`](file:///e:/motion/frontend/app/context/AuthContext.tsx#L257)
- **Description**: Registers a new user account with selected subscription plan tier.
- **Request Body**:
```json
{
  "name": "Pradum Singh",
  "email": "pradum@byreel.io",
  "password": "SecurePassword123!",
  "plan": "free"
}
```
- **Response `201 Created`**: Returns same user object structure as `/api/login` with JWT token.

---

#### 3. `GET /api/google/auth` & `GET /api/google/url`
- **Frontend Source**: [`app/components/GoogleAuthButton.tsx:55`](file:///e:/motion/frontend/app/components/GoogleAuthButton.tsx#L55) & [`app/lib/api.ts:251-289`](file:///e:/motion/frontend/app/lib/api.ts#L251-L289)
- **Query Parameters**:
  - `origin`: e.g. `http://localhost:3000`
  - `mode`: `"login"` | `"register"`
  - `plan`: `"free"` | `"creator"` | `"pro"` | `"enterprise"`
  - `popup`: `"true"` | `"false"`
- **Response Behavior**:
  - In popup mode: Initiates Google OAuth consent screen, and upon completion renders HTML containing:
    ```html
    <script>
      window.opener.postMessage({
        type: "GOOGLE_AUTH_SUCCESS",
        token: "...",
        user: { ... }
      }, window.location.origin);
      window.close();
    </script>
    ```

---

#### 4. `POST /api/logout`
- **Frontend Source**: [`AuthContext.tsx:390`](file:///e:/motion/frontend/app/context/AuthContext.tsx#L390) & [`api.ts:303`](file:///e:/motion/frontend/app/lib/api.ts#L303)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3.2 User Profile & Account Settings

#### 1. `GET /api/user/me`
- **Frontend Source**: [`AuthContext.tsx:87`](file:///e:/motion/frontend/app/context/AuthContext.tsx#L87) (called on session mount and refresh)
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Returns validated profile information and live quota metrics.
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": { ... } // BackendUser object (matching schema in /api/login)
}
```

---

#### 2. `PATCH /api/user/profile`
- **Frontend Source**: [`AccountSection.tsx:26-30`](file:///e:/motion/frontend/app/dashboard/components/sections/AccountSection.tsx#L26-L30)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "displayName": "Pradum Singh",
  "email": "pradum@byreel.io",
  "role": "Lead Creative Director",
  "avatarUrl": "/dashboard/user-avatar.jpg"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

#### 3. `PATCH /api/user/preferences`
- **Frontend Source**: [`AccountSection.tsx:128-160`](file:///e:/motion/frontend/app/dashboard/components/sections/AccountSection.tsx#L128-L160)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "renderCompletionAlerts": true,
  "hardwareAcceleration": true,
  "productUpdates": false
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "preferences": {
    "renderCompletionAlerts": true,
    "hardwareAcceleration": true,
    "productUpdates": false
  }
}
```

---

### 3.3 Prompt Queue & Video Generation Pipeline

#### 1. `POST /api/prompt`
- **Frontend Source**: [`app/lib/api.ts:382`](file:///e:/motion/frontend/app/lib/api.ts#L382), [`app/dashboard/hooks/useChats.ts:164`](file:///e:/motion/frontend/app/dashboard/hooks/useChats.ts#L164), and [`app/api/prompt/route.ts:39`](file:///e:/motion/frontend/app/api/prompt/route.ts#L39)
- **Headers**: `Authorization: Bearer <token>` (or `x-api-key: <key>`)
- **Request Body**:
```json
{
  "prompt": "High-octane product launch video with neon lime accent lighting, 360 degree turntable, and kinetic zooms",
  "promptId": "p-1728556800000-a8f12",
  "userId": "usr_94829104",
  "template": "Kinetic Typography",
  "ratio": "16:9",
  "model": "octane"
}
```
- **Response `200 OK / 202 Accepted`**:
```json
{
  "success": true,
  "job": {
    "id": "bull_job_99812",
    "promptId": "p-1728556800000-a8f12",
    "status": "queued"
  },
  "message": "Prompt submitted to generation queue",
  "billing": {
    "currency": "INR",
    "generationCount": 1,
    "creditsPerGeneration": 1,
    "totalCredits": 1,
    "rateInrPerCredit": 10,
    "totalInr": 10
  }
}
```

---

#### 2. `GET /api/prompt/:promptId`
- **Frontend Source**: [`app/lib/api.ts:388`](file:///e:/motion/frontend/app/lib/api.ts#L388) & [`useChats.ts:64`](file:///e:/motion/frontend/app/dashboard/hooks/useChats.ts#L64)
- **Description**: Polled every 3 seconds to check status of a queued video render.
- **Response (When Queued / Running)`200 OK`**:
```json
{
  "success": true,
  "job": {
    "id": "bull_job_99812",
    "promptId": "p-1728556800000-a8f12",
    "status": "running",
    "harnessJobId": "arn:aws:ecs:us-east-1:gpu-worker-08",
    "play": [],
    "error": null
  }
}
```
- **Response (When Done)`200 OK`**:
```json
{
  "success": true,
  "job": {
    "id": "bull_job_99812",
    "promptId": "p-1728556800000-a8f12",
    "status": "done",
    "harnessJobId": "arn:aws:ecs:us-east-1:gpu-worker-08",
    "play": [
      "https://cdn.byreel.io/renders/p-1728556800000-a8f12_master.mp4"
    ],
    "error": null
  }
}
```

---

### 3.4 Conversation History & Chat Sync

*(Currently persisted in browser `localStorage: byreel.chats.v2:${userId}` via [`chatStore.ts`](file:///e:/motion/frontend/app/dashboard/lib/chatStore.ts). A multi-device backend sync requires these 4 endpoints).*

#### 1. `GET /api/conversations`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "conversations": [
    {
      "id": "c-44bf8a21-9981",
      "title": "Velocity Sneaker Launch",
      "createdAt": "2026-10-09T14:32:00.000Z",
      "updatedAt": "2026-10-10T10:15:00.000Z",
      "messages": [
        {
          "id": "m-8812a",
          "role": "user",
          "content": "Luxury minimalist running shoe with neon lime accent lighting",
          "createdAt": "2026-10-09T14:32:00.000Z"
        },
        {
          "id": "m-8812b",
          "role": "assistant",
          "content": "Your video is ready.",
          "promptId": "p-1728556800000-a8f12",
          "createdAt": "2026-10-09T14:34:10.000Z",
          "preview": {
            "title": "Velocity Sneaker Launch",
            "url": "https://cdn.byreel.io/renders/p-1728556800000-a8f12_master.mp4"
          }
        }
      ]
    }
  ]
}
```

#### 2. `POST /api/conversations`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "New Short",
  "initialPrompt": "Product launch video for a fintech card"
}
```

#### 3. `PATCH /api/conversations/:id` (Rename Chat)
- **Request Body**: `{ "title": "Updated Short Title" }`

#### 4. `DELETE /api/conversations/:id` (Delete Chat)

---

### 3.5 Product Launch & URL Scraper Engine

#### 1. `POST /api/launch/scan-url`
- **Frontend Source**: [`ProductLaunchSection.tsx:273-295`](file:///e:/motion/frontend/app/dashboard/components/sections/ProductLaunchSection.tsx#L273-L295)
- **Description**: Scrapes a SaaS/Product landing page URL (e.g. `https://linear.app`), extracts branding metadata, color schemes, key marketing copy, and constructs a 30-second 4-beat storyboard script.
- **Request Body**:
```json
{
  "url": "https://linear.app",
  "category": "saas"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "product": {
    "brandName": "Linear Next",
    "domain": "linear.app",
    "tagline": "The issue tracker designed for high-velocity software teams.",
    "keyFeature": "Sub-50ms offline synchronization with bi-directional Git sync.",
    "brandColor": "#5E6AD2",
    "accentColor": "#8B96F5",
    "category": "Developer Tools & CLI",
    "techStack": ["Next.js", "GraphQL", "Sync Engine", "Rust Core"],
    "latency": "8ms",
    "beats": [
      "00:00 - 00:06: Kinetic terminal typing 'linear --sync-all' at lightning speed",
      "00:06 - 00:15: Sleek monochrome kanban board sliding with zero frame drops",
      "00:15 - 00:23: Sub-50ms sync badge expanding with neon violet particle glow",
      "00:23 - 00:30: 'Crafted for High Velocity' stamped with linear.app CTA"
    ],
    "suggestedPrompt": "An enterprise SaaS product launch video for Linear. Sleek dark mode UI, purple laser sweeps, kinetic terminal commands, and 60FPS fluid kanban transitions."
  }
}
```

---

### 3.6 Media & Assets Storage (Blob Store)

#### 1. `GET /api/assets`
- **Frontend Source**: [`app/dashboard/lib/assets.ts:39`](file:///e:/motion/frontend/app/dashboard/lib/assets.ts#L39) & [`AssetsSection.tsx`](file:///e:/motion/frontend/app/dashboard/components/sections/AssetsSection.tsx)
- **Response `200 OK`**:
```json
{
  "success": true,
  "assets": [
    {
      "id": "a-9941a",
      "name": "brand-logo-white.svg",
      "kind": "image",
      "size": 142080,
      "sourceUrl": "https://cdn.byreel.io/assets/usr_94829104/brand-logo-white.svg",
      "createdAt": "2026-10-09T10:00:00.000Z"
    }
  ]
}
```

#### 2. `POST /api/assets/upload`
- **Description**: Multipart form data file upload supporting images, video b-rolls, audio tracks, and custom fonts.
- **Request**: `multipart/form-data` with `file`, `kind` (`image` | `video` | `audio` | `font` | `other`).
- **Response `201 Created`**:
```json
{
  "success": true,
  "asset": {
    "id": "a-9941b",
    "name": "voiceover-track.mp3",
    "kind": "audio",
    "size": 4194304,
    "sourceUrl": "https://cdn.byreel.io/assets/usr_94829104/voiceover-track.mp3",
    "createdAt": "2026-10-10T08:30:00.000Z"
  }
}
```

#### 3. `DELETE /api/assets/:id`
- **Deletes an asset from Cloud Storage & database**.

---

### 3.7 Brand Kit Management

#### 1. `GET /api/brand-kit`
- **Frontend Source**: [`brandKit.ts:53`](file:///e:/motion/frontend/app/dashboard/lib/brandKit.ts#L53) & [`BrandKitSection.tsx`](file:///e:/motion/frontend/app/dashboard/components/sections/BrandKitSection.tsx)
- **Response `200 OK`**:
```json
{
  "success": true,
  "brandKit": {
    "brandName": "Byreel Studio",
    "tagline": "Turn ideas into motion.",
    "voice": "Minimalist & Luxury",
    "colors": [
      { "id": "col-1", "name": "Ink", "value": "#111110" },
      { "id": "col-2", "name": "Paper", "value": "#FCFBF7" },
      { "id": "col-3", "name": "Accent", "value": "#C5EF26" }
    ],
    "headingFont": "Instrument Serif",
    "bodyFont": "Geist",
    "logoUrl": "https://cdn.byreel.io/assets/brand-logo.png",
    "updatedAt": "2026-10-09T18:00:00.000Z"
  }
}
```

#### 2. `PUT /api/brand-kit`
- **Request Body**: Complete or partial `BrandKit` object to persist across cloud sessions.

---

### 3.8 Projects & Exports

#### 1. `GET /api/projects`
- **Frontend Source**: [`ProjectsSection.tsx:94`](file:///e:/motion/frontend/app/dashboard/components/sections/ProjectsSection.tsx#L94)
- **Response `200 OK`**:
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj-1",
      "title": "Product Launch Video",
      "timecode": "00:32",
      "thumbnail": "https://cdn.byreel.io/thumbnails/proj-1.jpg",
      "status": "Completed",
      "ratio": "16:9",
      "updatedAt": "2026-10-10T11:00:00.000Z"
    }
  ]
}
```

#### 2. `GET /api/exports`
- **Frontend Source**: [`ExportsSection.tsx:31-80`](file:///e:/motion/frontend/app/dashboard/components/sections/ExportsSection.tsx#L31-L80)
- **Response `200 OK`**: Returns list of completed video exports (MP4, ProRes, WebM) with download URLs and file byte sizes.

#### 3. `POST /api/exports`
- **Frontend Source**: Triggered from Studio Mockup / Exports action.
- **Request Body**:
```json
{
  "projectId": "proj-1",
  "resolution": "4K",
  "format": "MP4",
  "fps": 60
}
```

---

### 3.9 Developer API Keys & Webhooks

#### 1. `GET /api/keys`
- **Frontend Source**: [`app/api-keys/page.tsx:55`](file:///e:/motion/frontend/app/api-keys/page.tsx#L55) via [`api.keys.list()`](file:///e:/motion/frontend/app/lib/api.ts#L324)
- **Response `200 OK`**:
```json
{
  "success": true,
  "keys": [
    {
      "id": "key_88f9104",
      "name": "Production CLI Render Key",
      "prefix": "byreel_live_sk_89f0",
      "environment": "production",
      "scopes": ["render", "prompt:read", "prompt:write"],
      "rateLimitPerMinute": 60,
      "status": "active",
      "createdAt": "2026-10-01T12:00:00.000Z",
      "lastUsedAt": "2026-10-10T09:12:00.000Z",
      "expiresAt": null
    }
  ]
}
```

#### 2. `POST /api/keys`
- **Frontend Source**: [`app/api-keys/page.tsx:92`](file:///e:/motion/frontend/app/api-keys/page.tsx#L92) via [`api.keys.create()`](file:///e:/motion/frontend/app/lib/api.ts#L328)
- **Request Body**:
```json
{
  "name": "GitHub CI Pipeline",
  "environment": "production",
  "scopes": ["render"],
  "expiresInDays": 90
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "API Key created successfully",
  "apiKey": {
    "id": "key_994182",
    "name": "GitHub CI Pipeline",
    "prefix": "byreel_live_sk_33ea",
    "environment": "production",
    "scopes": ["render"],
    "rateLimitPerMinute": 60,
    "status": "active",
    "createdAt": "2026-10-10T12:00:00.000Z",
    "lastUsedAt": null,
    "expiresAt": "2027-01-08T12:00:00.000Z"
  },
  "secretKey": "byreel_live_sk_33ea49108bcf12948194a"
}
```

#### 3. `DELETE /api/keys/:keyId`
- **Frontend Source**: [`api.keys.revoke()`](file:///e:/motion/frontend/app/lib/api.ts#L344)

---

### 3.10 Subscriptions, Billing & Invoices

#### 1. `POST /api/user/plan`
- **Frontend Source**: [`BillingSection.tsx:73`](file:///e:/motion/frontend/app/dashboard/components/sections/BillingSection.tsx#L73) & [`app/billing/page.tsx:199`](file:///e:/motion/frontend/app/billing/page.tsx#L199)
- **Request Body**:
```json
{
  "tier": "pro",
  "interval": "annual"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Plan updated to PRO Studio (annual)",
  "user": { ... } // Updated BackendUser
}
```

#### 2. `GET /api/billing/invoices`
- **Frontend Source**: [`BillingSection.tsx:8`](file:///e:/motion/frontend/app/dashboard/components/sections/BillingSection.tsx#L8)
- **Response `200 OK`**:
```json
{
  "success": true,
  "invoices": [
    {
      "id": "INV-2026-003",
      "date": "2026-10-01",
      "amount": "$29.00",
      "status": "Paid",
      "pdfUrl": "https://api.byreel.io/v1/invoices/INV-2026-003.pdf"
    }
  ]
}
```

---

### 3.11 Vector Typography & Character Conversion

#### 1. `POST /api/motion/char-conversion`
- **Frontend Source**: [`app/lib/api.ts:356-366`](file:///e:/motion/frontend/app/lib/api.ts#L356-L366)
- **Description**: Converts text typography into procedural SVG vectors and animation keyframe coordinates for canvas/Remotion rendering.
- **Request Body**:
```json
{
  "text": "TURN IDEAS INTO MOTION",
  "fontFamily": "Instrument Serif",
  "fontSize": 120,
  "effect": "kinetic_split",
  "physics": {
    "tension": 180,
    "damping": 12,
    "mass": 1
  }
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "text": "TURN IDEAS INTO MOTION",
  "id": "glyph_99182",
  "glyphs": [
    {
      "char": "T",
      "svgPath": "M 10 20 L 50 20 L 50 80 ... Z",
      "width": 64,
      "height": 120,
      "keyframes": [
        { "time": 0, "x": 0, "y": 40, "scale": 0.8, "opacity": 0, "rotation": -5 },
        { "time": 0.6, "x": 0, "y": 0, "scale": 1, "opacity": 1, "rotation": 0 }
      ]
    }
  ],
  "totalDurationMs": 3000
}
```

---

## 4. Standard Backend Error Response Schema

All endpoints follow a unified error envelope matching [`ApiErrorResponse` in `app/lib/api.ts:32-37`](file:///e:/motion/frontend/app/lib/api.ts#L32-L37):

```json
{
  "success": false,
  "message": "Human readable error description",
  "error": "ERROR_CODE_STRING",
  "errors": {
    "email": ["Please provide a valid studio email address."],
    "password": ["Password must contain at least 8 characters."]
  }
}
```

| HTTP Status Code | Meaning | Example Trigger |
| :---: | :--- | :--- |
| `400 Bad Request` | Validation failure | Missing prompt string, invalid email format |
| `401 Unauthorized` | Invalid/expired session | Missing or expired JWT / session cookie |
| `403 Forbidden` | Quota exceeded / Role restriction | GPU compute quota reached on Free tier |
| `404 Not Found` | Resource absent | Non-existent `promptId` or `keyId` |
| `429 Too Many Requests` | Rate limit breached | Key exceeded rate limit per minute |
| `500 Internal Error` | Unhandled backend exception | Cluster database unreachable |
| `503 Service Unavailable` | GPU worker cluster busy | GPU node timeout while rendering shader |

---

## 5. Next Steps for Backend Implementation
1. **Express / NestJS / FastAPI Routes**: Implement routes according to Section 3 schemas.
2. **BullMQ / Celery Queue Worker**: Ensure `POST /api/prompt` connects to the GPU rendering cluster and updates job state for `GET /api/prompt/:promptId`.
3. **S3 / GCS Blob Store**: Provide pre-signed upload URLs for `/api/assets/upload` to store user-uploaded MP4s, GLTF models, audio, and SVG logos.
4. **Google OAuth Callback**: Verify server-side redirect returns the specified `window.postMessage` payload to resolve popup authentication cleanly.
