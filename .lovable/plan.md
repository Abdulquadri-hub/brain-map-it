
# Dashboard Implementation Plan - Phase 1
## Foundation, Security & WhatsApp Integration

---

## What We're Building First

### 1. Update Live Session Platform Types
- Change from `google_meet | zoom | teams` to `jitsi | zoom | custom`
- Add secure session link types with token-based access

### 2. WhatsApp Group Management
- Add WhatsApp link fields to Batch type
- Create `WhatsAppGroupCard.tsx` component for beautiful display
- Only visible to enrolled students and assigned instructors

### 3. Secure Live Class Links
- Unique links per session with tokens
- Time-limited validity (15 min before to 30 min after)
- Verified against enrollment before access

### 4. School Owner Batch Pages
- `BatchesPage.tsx` - List all batches across courses
- `BatchDetailPage.tsx` - Single batch with students, WhatsApp, sessions

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/types/job-portal.ts` | Job portal types for tutor marketplace |
| `src/components/batches/BatchCard.tsx` | Batch display card |
| `src/components/batches/CreateBatchDialog.tsx` | Create new batch |
| `src/components/batches/WhatsAppGroupCard.tsx` | WhatsApp group display |
| `src/components/sessions/SecureJoinButton.tsx` | Secure session join |
| `src/pages/dashboard/BatchesPage.tsx` | List all batches |
| `src/pages/dashboard/BatchDetailPage.tsx` | Single batch view |

---

## Files to Update

| File | Changes |
|------|---------|
| `src/types/live-session.ts` | Update `LivePlatform` type, add `SecureSessionLink` |
| `src/types/batch.ts` | Add `whatsAppLink`, `whatsAppGroupName` fields |
| `src/components/dashboard/DashboardSidebar.tsx` | Add Batches menu item |
| `src/App.tsx` | Add new batch routes |

---

## Type Definitions

### SecureSessionLink (new)
```typescript
interface SecureSessionLink {
  id: string;
  sessionId: string;
  batchId: string;
  token: string;           // Unique cryptographic token
  userId: string;
  userType: "student" | "instructor";
  validFrom: string;       // 15 min before session
  validUntil: string;      // 30 min after session end
  isUsed: boolean;
}
```

### Batch (updated)
```typescript
interface Batch {
  // ... existing fields
  whatsAppLink?: string;
  whatsAppGroupName?: string;
}
```

---

## Implementation Order

1. Update `src/types/live-session.ts` - New platform types
2. Update `src/types/batch.ts` - Add WhatsApp fields  
3. Create `src/types/job-portal.ts` - Job portal types
4. Create `BatchCard.tsx` component
5. Create `WhatsAppGroupCard.tsx` component
6. Create `CreateBatchDialog.tsx` component
7. Create `SecureJoinButton.tsx` component
8. Create `BatchesPage.tsx` page
9. Create `BatchDetailPage.tsx` page
10. Update `DashboardSidebar.tsx` - Add Batches link
11. Update `App.tsx` - Add routes

---

## Technical Notes

- All WhatsApp links verified server-side before display
- Live session tokens expire and cannot be reused
- Jitsi rooms use unique names: `teach-{schoolId}-{batchId}-{sessionId}`
- Job portal types prepared for Phase 7-8 implementation
