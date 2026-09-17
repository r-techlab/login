# Cash Payment Voucher (CPV) Deployment Guide

## Overview
A new **Cash Payment Voucher (CPV)** module has been added, modeled exactly on the existing **Cash Receipt Voucher (CRV)** module (which itself is modeled on the Bank Receipt Voucher module). It provides a full voucher lifecycle: form entry, list, A4 print, and a date-range report. CPV records are stored in the **same** `JournalVoucherHeader` / `JournalVoucherDetails` sheets as JV/BRV/CRV records, distinguished by the **`DocType`** column (`CPV`). Posting writes to the shared `AccountTransaction` sheet with `DocType = CPV`, so existing reports (Trial Balance, P&L, Balance Sheet, Statement of Account) pick up CPV entries automatically.

Document numbers use the `CPV` prefix and continue the existing numbering convention: `CPV1001`, `CPV1002`, ...

> **Cash-only design:** Because a Cash Payment Voucher is always paid out in cash, the CPV **form**, **print** and **report** pages do **not** show the Mode / Bank / Instrument No / Instrument Date columns that BRV has. The backend still writes those 4 detail columns as empty strings so the shared `JournalVoucherDetails` sheet stays column-aligned with JV/BRV/CRV rows (no sheet schema changes are required).

## Files Created/Modified

### New Files:
1. **cashpaymentvoucherform.htm** - CPV entry form (header fields + detail lines with Debit/Credit; view/edit/post/cancel-post/print/accounting-entry actions). No Mode/Bank/Instrument columns.
2. **cashpaymentvoucherlist.htm** - CPV list with server-side pagination, search, and actions (view/edit/delete/post/cancel post)
3. **cashpaymentvoucherprint.htm** - A4 print layout ("CASH PAYMENT VOUCHER"). No Mode/Bank/Instrument columns.
4. **cashpaymentvoucherreport.htm** - CPV date-range report (headerwise / linewise) with CSV export. No Mode column in linewise mode.
5. **CASH_PAYMENT_VOUCHER_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 8 CPV API functions:
   - `apiGetCashPaymentVouchers(page, pageSize, search, callback)`
   - `apiGetCashPaymentVoucherByDocNo(docNo, callback)`
   - `apiCreateCashPaymentVoucher(cpvData, callback)` (30s timeout, like JV/BRV/CRV create)
   - `apiUpdateCashPaymentVoucher(cpvData, callback)`
   - `apiDeleteCashPaymentVoucher(docNo, callback)`
   - `apiPostCPVToAccountTransaction(docNo, callback)`
   - `apiCancelCPVAccountTransactionPost(docNo, callback)`
   - `apiGetCashPaymentVoucherReport(filters, callback)`

2. **AppScript.txt** -
   - Added dispatch entries in `doGet()` for: `getCashPaymentVouchers`, `getCashPaymentVoucherByDocNo`, `createCashPaymentVoucher`, `updateCashPaymentVoucher`, `deleteCashPaymentVoucher`, `postCPVToAccountTransaction`, `cancelCPVAccountTransactionPost`, `getCashPaymentVoucherReport`
   - Added handler functions:
     - `handleGetCashPaymentVouchersGet(e)`
     - `handleGetCashPaymentVoucherByDocNoGet(e)`
     - `handleCreateCashPaymentVoucherGet(e)`

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `doGet()` dispatch entries from `AppScript.txt` into your Google Apps Script project's `doGet()` function (after the `getCashReceiptVoucherReport` branch).
2. Copy the 8 `handle*CashPaymentVoucher*Get(e)` handler functions into the project.
3. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `cashpaymentvoucherform.htm` (new)
- `cashpaymentvoucherlist.htm` (new)
- `cashpaymentvoucherprint.htm` (new)
- `cashpaymentvoucherreport.htm` (new)
- `api.js` (updated)

### 4. Add Menu Entries
To make the CPV pages accessible through the navigation menu:

1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet** - go to the **MenuMaster** tab and add rows in the same group as the Journal Voucher / Bank Receipt Voucher / Cash Receipt Voucher menus (use the next available MenuIds):
   ```
   MenuId: <next available ID>
   ParentMenuId: <same parent as the Journal Voucher menus>
   MenuType: P (for Page)
   MenuName: Cash Payment Voucher
   PageUrl: cashpaymentvoucherform.htm
   SortOrder: <your preferred order, e.g., right after the CRV menus>
   ```
   Repeat for the List and Report pages:
   - MenuName: `Cash Payment Voucher List`, PageUrl: `cashpaymentvoucherlist.htm`
   - MenuName: `Cash Payment Voucher Report`, PageUrl: `cashpaymentvoucherreport.htm`

3. **Grant Admin Access** - go to the **RoleMenuAccess** tab and add rows for each new MenuId:
   ```
   RoleId: 1 (or your Admin role ID)
   MenuId: <the MenuId you created above>
   ```

4. Logout and login again to refresh menu permissions.

## API Endpoints

### Get Cash Payment Vouchers (paginated list)
```
GET ?action=getCashPaymentVouchers&sessionId={sessionId}&userId={userId}&page={page}&pageSize={pageSize}&search={search}&callback={callback}
```

### Get Cash Payment Voucher by DocNo
```
GET ?action=getCashPaymentVoucherByDocNo&sessionId={sessionId}&userId={userId}&docNo={docNo}&callback={callback}
```
**Response:** `{ "status": "success", "jv": { "header": {...}, "details": [...] } }`

### Create Cash Payment Voucher
```
GET ?action=createCashPaymentVoucher&sessionId={sessionId}&userId={userId}&cpvData={json}&callback={callback}
```
`cpvData` shape (same as JV/BRV/CRV, without mode/bank fields):
```json
{
  "header": { "docType": "CPV", "docNo": null, "date": "2026-08-11", "narration": "...", "debit": 100, "credit": 100, "refNo": "", "refDate": "" },
  "details": [
    { "docSrNo": 1, "acCode": "...", "acDescription": "...", "subledger": "", "amount": -100, "narration": "" },
    { "docSrNo": 2, "acCode": "...", "acDescription": "...", "subledger": "", "amount": 100, "narration": "" }
  ]
}
```
**Response:** `{ "status": "success", "message": "Cash Payment Voucher created successfully", "docNo": "CPV1001" }`

### Update / Delete / Post / Cancel Post
- `updateCashPaymentVoucher` - same body as create; requires `header.docNo`
- `deleteCashPaymentVoucher` - `docNo` param (blocked if already posted)
- `postCPVToAccountTransaction` - `docNo` param; writes `AccountTransaction` rows with `DocType = 'CPV'`
- `cancelCPVAccountTransactionPost` - `docNo` param; deletes those `AccountTransaction` rows and clears posted status

### Get Cash Payment Voucher Report
```
GET ?action=getCashPaymentVoucherReport&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&reportType={headerwise|linewise}&callback={callback}
```
**Response:** `{ "status": "success", "jv": [...], "reportType": "...", "summary": { "totalCount": n, "totalDebit": n, "totalCredit": n } }`

## Frontend Features
- **Form**: DocNo (auto-generated, disabled), Date, Narration, Reference No/Date, Created By/Time; detail lines with Debit/Credit type, searchable GL account, description, subledger (AP/AR-aware), amount, line narration. **No Mode/Bank/Instrument columns (cash-only).** Live balance check (Debit must equal Credit). Actions: Save/Update, View, Edit, Delete, Print, Post, Cancel Post, Accounting Entry modal.
- **List**: pagination, search by DocNo/Narration/Date, and per-row view/edit/delete/post/cancel-post actions.
- **Print**: A4 layout with company logo/name, "CASH PAYMENT VOUCHER" title, entries table, totals, amount in words, signature blocks. No Mode/Bank/Instrument columns.
- **Report**: date-range filter, headerwise/linewise modes, summary totals, CSV export. No Mode column in linewise mode.

## Verification Checklist
- [ ] Deployed Apps Script new version; `API_URL` in `api.js` updated
- [ ] Uploaded the 4 new CPV pages and updated `api.js` to web hosting
- [ ] Added 3 MenuMaster rows (Form / List / Report) + RoleMenuAccess grants for Admin
- [ ] Created a CPV - docNo shows as `CPV1001`; header + details saved with `DocType = CPV`
- [ ] Edited the CPV; confirmed changes persist
- [ ] Printed the CPV; print title shows "CASH PAYMENT VOUCHER"
- [ ] Ran the CPV report (headerwise + linewise + CSV)
- [ ] Posted the CPV; verified `AccountTransaction` rows with `DocType = CPV`
- [ ] Cancelled the post; verified entries removed and posted status cleared
- [ ] Deleted the CPV (unposted); verified header + details removed
- [ ] **JV regression check**: JV list and JV report show ONLY `JV` records (no CPV rows)
- [ ] **BRV regression check**: BRV list and BRV report show ONLY `BRV` records (no CPV rows)
- [ ] **CRV regression check**: CRV list and CRV report show ONLY `CRV` records (no CPV rows)
- [ ] **BPV regression check**: BPV list and BPV report show ONLY `BPV` records (no CPV rows)
- [ ] Trial Balance / Statement of Account include posted CPV amounts

     - `handleUpdateCashPaymentVoucherGet(e)`
     - `handleDeleteCashPaymentVoucherGet(e)`
     - `handlePostCPVToAccountTransactionGet(e)`
     - `handleCancelCPVAccountTransactionPostGet(e)`
     - `handleGetCashPaymentVoucherReportGet(e)`
   - **No changes to existing JV/BRV/CRV handlers are required** - JV handlers filter `DocType = 'JV'`, BRV handlers filter `DocType = 'BRV'`, and CRV handlers filter `DocType = 'CRV'`, so CPV rows are automatically excluded from their lists/reports.

## How CPV Storage Works
- **JournalVoucherHeader** - one row per CPV header: `DocType` (`CPV`), `DocNo` (`CPV1001`, ...), `Date`, `Narration`, `Debit`, `Credit`, `RefNo`, `RefDate`, `CreatedBy`, `CreatedTime`, `PostedBy`, `PostedTime`
- **JournalVoucherDetails** - one row per CPV detail line: `DocType` (`CPV`), `DocNo`, `DocSrNo`, `ACCode`, `ACDescription`, `Subledger`, `Amount` (negative = debit, positive = credit), `Narration`, `Mode`, `Bank`, `InstrumentNo`, `InstrumentDate` (the last 4 are stored as empty strings for cash-only vouchers)
- **AccountTransaction** - created on Post with `DocType = 'CPV'`, exactly like JV/BRV/CRV entries. Cancel Post deletes only `CPV` rows for the document.
- **No new sheets are required.** The `DocType` column already existed in all three sheets.

## Allocation (AR / AP) - added with the Allocation module
- The CPV entry grid has a new **Allocation** column. It is active only for accounts that have a
  subledger (`COA.SUBLEDGER_EXISTS = 1` and `COA.ACTYPE_DOCNO = AP`), i.e. the supplier line of the
  voucher, and only after the supplier has been selected.
- `🔗 Allocate` opens a modal with the pending Purchase Invoices (PI) of that supplier
  (`AccountTransaction` rows with the same `AC_DOCNO` + `SUBLEDGER_DOCNO` and a remaining `BAL_AMOUNT`),
  where the CPV amount can be applied to one or more invoices (partial allocation is allowed).
- The allocation is saved with the voucher in the new `JournalVoucherDetails` column
  `AllocationJSON` (M). It is written to the **Allocation** sheet and `BAL_AMOUNT` is updated on both
  sides (CPV AP line `+=`, invoice AP line `-=`) when the voucher is **posted**; **Cancel Post**
  removes the Allocation rows and restores the invoice balances.
- Saving a CPV whose AP line is not fully allocated asks for confirmation.
- New API functions: `apiGetAllocationOutstanding()` and `apiGetVoucherAllocations()`.
  See **ALLOCATION_DEPLOYMENT.md** for the full guide.
