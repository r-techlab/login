# Cash Receipt Voucher (CRV) Deployment Guide

## Overview
A new **Cash Receipt Voucher (CRV)** module has been added, modeled exactly on the existing **Bank Receipt Voucher (BRV)** module (which itself is modeled on the Journal Voucher module). It provides a full voucher lifecycle: form entry, list, A4 print, and a date-range report. CRV records are stored in the **same** `JournalVoucherHeader` / `JournalVoucherDetails` sheets as JV/BRV records, distinguished by the **`DocType`** column (`CRV`). Posting writes to the shared `AccountTransaction` sheet with `DocType = CRV`, so existing reports (Trial Balance, P&L, Balance Sheet, Statement of Account) pick up CRV entries automatically.

Document numbers use the `CRV` prefix and continue the existing numbering convention: `CRV1001`, `CRV1002`, ...

> **Cash-only design:** Because a Cash Receipt Voucher is always received in cash, the CRV **form**, **print** and **report** pages do **not** show the Mode / Bank / Instrument No / Instrument Date columns that BRV has. The backend still writes those 4 detail columns as empty strings so the shared `JournalVoucherDetails` sheet stays column-aligned with JV/BRV rows (no sheet schema changes are required).

## Files Created/Modified

### New Files:
1. **cashreceiptvoucherform.htm** - CRV entry form (header fields + detail lines with Debit/Credit; view/edit/post/cancel-post/print/accounting-entry actions). No Mode/Bank/Instrument columns.
2. **cashreceiptvoucherlist.htm** - CRV list with server-side pagination, search, and actions (view/edit/delete/post/cancel post)
3. **cashreceiptvoucherprint.htm** - A4 print layout ("CASH RECEIPT VOUCHER"). No Mode/Bank/Instrument columns.
4. **cashreceiptvoucherreport.htm** - CRV date-range report (headerwise / linewise) with CSV export. No Mode column in linewise mode.
5. **CASH_RECEIPT_VOUCHER_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 8 CRV API functions:
   - `apiGetCashReceiptVouchers(page, pageSize, search, callback)`
   - `apiGetCashReceiptVoucherByDocNo(docNo, callback)`
   - `apiCreateCashReceiptVoucher(crvData, callback)` (30s timeout, like JV/BRV create)
   - `apiUpdateCashReceiptVoucher(crvData, callback)`
   - `apiDeleteCashReceiptVoucher(docNo, callback)`
   - `apiPostCRVToAccountTransaction(docNo, callback)`
   - `apiCancelCRVAccountTransactionPost(docNo, callback)`
   - `apiGetCashReceiptVoucherReport(filters, callback)`

2. **AppScript.txt** -
   - Added dispatch entries in `doGet()` for: `getCashReceiptVouchers`, `getCashReceiptVoucherByDocNo`, `createCashReceiptVoucher`, `updateCashReceiptVoucher`, `deleteCashReceiptVoucher`, `postCRVToAccountTransaction`, `cancelCRVAccountTransactionPost`, `getCashReceiptVoucherReport`
   - Added handler functions:
     - `handleGetCashReceiptVouchersGet(e)`
     - `handleGetCashReceiptVoucherByDocNoGet(e)`
     - `handleCreateCashReceiptVoucherGet(e)`

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `doGet()` dispatch entries from `AppScript.txt` into your Google Apps Script project's `doGet()` function (after the `getBankReceiptVoucherReport` branch).
2. Copy the 8 `handle*CashReceiptVoucher*Get(e)` handler functions into the project.
3. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `cashreceiptvoucherform.htm` (new)
- `cashreceiptvoucherlist.htm` (new)
- `cashreceiptvoucherprint.htm` (new)
- `cashreceiptvoucherreport.htm` (new)
- `api.js` (updated)

### 4. Add Menu Entries
To make the CRV pages accessible through the navigation menu:

1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet** - go to the **MenuMaster** tab and add rows in the same group as the Journal Voucher / Bank Receipt Voucher menus (use the next available MenuIds):
   ```
   MenuId: <next available ID>
   ParentMenuId: <same parent as the Journal Voucher menus>
   MenuType: P (for Page)
   MenuName: Cash Receipt Voucher
   PageUrl: cashreceiptvoucherform.htm
   SortOrder: <your preferred order, e.g., right after the BRV menus>
   ```
   Repeat for the List and Report pages:
   - MenuName: `Cash Receipt Voucher List`, PageUrl: `cashreceiptvoucherlist.htm`
   - MenuName: `Cash Receipt Voucher Report`, PageUrl: `cashreceiptvoucherreport.htm`

3. **Grant Admin Access** - go to the **RoleMenuAccess** tab and add rows for each new MenuId:
   ```
   RoleId: 1 (or your Admin role ID)
   MenuId: <the MenuId you created above>
   ```

4. Logout and login again to refresh menu permissions.

## API Endpoints

### Get Cash Receipt Vouchers (paginated list)
```
GET ?action=getCashReceiptVouchers&sessionId={sessionId}&userId={userId}&page={page}&pageSize={pageSize}&search={search}&callback={callback}
```

### Get Cash Receipt Voucher by DocNo
```
GET ?action=getCashReceiptVoucherByDocNo&sessionId={sessionId}&userId={userId}&docNo={docNo}&callback={callback}
```
**Response:** `{ "status": "success", "jv": { "header": {...}, "details": [...] } }`

### Create Cash Receipt Voucher
```
GET ?action=createCashReceiptVoucher&sessionId={sessionId}&userId={userId}&crvData={json}&callback={callback}
```
`crvData` shape (same as JV/BRV, without mode/bank fields):
```json
{
  "header": { "docType": "CRV", "docNo": null, "date": "2026-08-11", "narration": "...", "debit": 100, "credit": 100, "refNo": "", "refDate": "" },
  "details": [
    { "docSrNo": 1, "acCode": "...", "acDescription": "...", "subledger": "", "amount": -100, "narration": "" },
    { "docSrNo": 2, "acCode": "...", "acDescription": "...", "subledger": "", "amount": 100, "narration": "" }
  ]
}
```
**Response:** `{ "status": "success", "message": "Cash Receipt Voucher created successfully", "docNo": "CRV1001" }`

### Update / Delete / Post / Cancel Post
- `updateCashReceiptVoucher` - same body as create; requires `header.docNo`
- `deleteCashReceiptVoucher` - `docNo` param (blocked if already posted)
- `postCRVToAccountTransaction` - `docNo` param; writes `AccountTransaction` rows with `DocType = 'CRV'`
- `cancelCRVAccountTransactionPost` - `docNo` param; deletes those `AccountTransaction` rows and clears posted status

### Get Cash Receipt Voucher Report
```
GET ?action=getCashReceiptVoucherReport&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&reportType={headerwise|linewise}&callback={callback}
```
**Response:** `{ "status": "success", "jv": [...], "reportType": "...", "summary": { "totalCount": n, "totalDebit": n, "totalCredit": n } }`

## Frontend Features
- **Form**: DocNo (auto-generated, disabled), Date, Narration, Reference No/Date, Created By/Time; detail lines with Debit/Credit type, searchable GL account, description, subledger (AP/AR-aware), amount, line narration. **No Mode/Bank/Instrument columns (cash-only).** Live balance check (Debit must equal Credit). Actions: Save/Update, View, Edit, Delete, Print, Post, Cancel Post, Accounting Entry modal.
- **List**: pagination, search by DocNo/Narration/Date, and per-row view/edit/delete/post/cancel-post actions.
- **Print**: A4 layout with company logo/name, "CASH RECEIPT VOUCHER" title, entries table, totals, amount in words, signature blocks. No Mode/Bank/Instrument columns.
- **Report**: date-range filter, headerwise/linewise modes, summary totals, CSV export. No Mode column in linewise mode.

## Verification Checklist
- [ ] Deployed Apps Script new version; `API_URL` in `api.js` updated
- [ ] Uploaded the 4 new CRV pages and updated `api.js` to web hosting
- [ ] Added 3 MenuMaster rows (Form / List / Report) + RoleMenuAccess grants for Admin
- [ ] Created a CRV - docNo shows as `CRV1001`; header + details saved with `DocType = CRV`
- [ ] Edited the CRV; confirmed changes persist
- [ ] Printed the CRV; print title shows "CASH RECEIPT VOUCHER"
- [ ] Ran the CRV report (headerwise + linewise + CSV)
- [ ] Posted the CRV; verified `AccountTransaction` rows with `DocType = CRV`
- [ ] Cancelled the post; verified entries removed and posted status cleared
- [ ] Deleted the CRV (unposted); verified header + details removed
- [ ] **JV regression check**: JV list and JV report show ONLY `JV` records (no CRV rows)
- [ ] **BRV regression check**: BRV list and BRV report show ONLY `BRV` records (no CRV rows)
- [ ] Trial Balance / Statement of Account include posted CRV amounts

     - `handleUpdateCashReceiptVoucherGet(e)`
     - `handleDeleteCashReceiptVoucherGet(e)`
     - `handlePostCRVToAccountTransactionGet(e)`
     - `handleCancelCRVAccountTransactionPostGet(e)`
     - `handleGetCashReceiptVoucherReportGet(e)`
   - **No changes to existing JV/BRV handlers are required** - JV handlers filter `DocType = 'JV'` and BRV handlers filter `DocType = 'BRV'`, so CRV rows are automatically excluded from their lists/reports.

## How CRV Storage Works
- **JournalVoucherHeader** - one row per CRV header: `DocType` (`CRV`), `DocNo` (`CRV1001`, ...), `Date`, `Narration`, `Debit`, `Credit`, `RefNo`, `RefDate`, `CreatedBy`, `CreatedTime`, `PostedBy`, `PostedTime`
- **JournalVoucherDetails** - one row per CRV detail line: `DocType` (`CRV`), `DocNo`, `DocSrNo`, `ACCode`, `ACDescription`, `Subledger`, `Amount` (negative = debit, positive = credit), `Narration`, `Mode`, `Bank`, `InstrumentNo`, `InstrumentDate` (the last 4 are stored as empty strings for cash-only vouchers)
- **AccountTransaction** - created on Post with `DocType = 'CRV'`, exactly like JV/BRV entries. Cancel Post deletes only `CRV` rows for the document.
- **No new sheets are required.** The `DocType` column already existed in all three sheets.
