# Bank Receipt Voucher (BRV) Deployment Guide

## Overview
A new **Bank Receipt Voucher (BRV)** module has been added, modeled exactly on the existing **Journal Voucher (JV)** module. It provides a full voucher lifecycle: form entry, list, A4 print, and a date-range report. BRV records are stored in the **same** `JournalVoucherHeader` / `JournalVoucherDetails` sheets as JV records, distinguished by the **`DocType`** column (`BRV`). Posting writes to the shared `AccountTransaction` sheet with `DocType = BRV`, so existing reports (Trial Balance, P&L, Balance Sheet, Statement of Account) pick up BRV entries automatically.

Document numbers use the `BRV` prefix and continue the existing numbering convention: `BRV1001`, `BRV1002`, ...

## Files Created/Modified

### New Files:
1. **bankreceiptvoucherform.htm** - BRV entry form (header fields + detail lines with Debit/Credit, Mode, Bank, Instrument No/Date; view/edit/post/cancel-post/print/accounting-entry actions)
2. **bankreceiptvoucherlist.htm** - BRV list with server-side pagination, search, and actions (view/edit/delete/post/cancel post)
3. **bankreceiptvoucherprint.htm** - A4 print layout ("BANK RECEIPT VOUCHER")
4. **bankreceiptvoucherreport.htm** - BRV date-range report (headerwise / linewise) with CSV export
5. **BANK_RECEIPT_VOUCHER_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 8 BRV API functions:
   - `apiGetBankReceiptVouchers(page, pageSize, search, callback)`
   - `apiGetBankReceiptVoucherByDocNo(docNo, callback)`
   - `apiCreateBankReceiptVoucher(brvData, callback)` (30s timeout, like JV create)
   - `apiUpdateBankReceiptVoucher(brvData, callback)`
   - `apiDeleteBankReceiptVoucher(docNo, callback)`
   - `apiPostBRVToAccountTransaction(docNo, callback)`
   - `apiCancelBRVAccountTransactionPost(docNo, callback)`
   - `apiGetBankReceiptVoucherReport(filters, callback)`

2. **AppScript.txt** -
   - Added dispatch entries in `doGet()` for: `getBankReceiptVouchers`, `getBankReceiptVoucherByDocNo`, `createBankReceiptVoucher`, `updateBankReceiptVoucher`, `deleteBankReceiptVoucher`, `postBRVToAccountTransaction`, `cancelBRVAccountTransactionPost`, `getBankReceiptVoucherReport`
   - Added handler functions:
     - `handleGetBankReceiptVouchersGet(e)`
     - `handleGetBankReceiptVoucherByDocNoGet(e)`
     - `handleCreateBankReceiptVoucherGet(e)`
     - `handleUpdateBankReceiptVoucherGet(e)`
     - `handleDeleteBankReceiptVoucherGet(e)`
     - `handlePostBRVToAccountTransactionGet(e)`
     - `handleCancelBRVAccountTransactionPostGet(e)`
     - `handleGetBankReceiptVoucherReportGet(e)`
   - **Modified existing JV handlers** to filter by `DocType = 'JV'` (because the sheets are now shared with BRV):
     - `handleGetJournalVouchersGet` (list) - only returns rows with empty `DocType` (legacy) or `DocType = 'JV'`
     - `handleGetJournalVoucherReportGet` (report) - same filter

## How BRV Storage Works
- **JournalVoucherHeader** - one row per BRV header: `DocType` (`BRV`), `DocNo` (`BRV1001`, ...), `Date`, `Narration`, `Debit`, `Credit`, `RefNo`, `RefDate`, `CreatedBy`, `CreatedTime`, `PostedBy`, `PostedTime`
- **JournalVoucherDetails** - one row per BRV detail line: `DocType` (`BRV`), `DocNo`, `DocSrNo`, `ACCode`, `ACDescription`, `Subledger`, `Amount` (negative = debit, positive = credit), `Narration`, `Mode`, `Bank`, `InstrumentNo`, `InstrumentDate`
- **AccountTransaction** - created on Post with `DocType = 'BRV'`, exactly like JV/Sales/Opening Stock entries. Cancel Post deletes only `BRV` rows for the document.
- **No new sheets are required.** The `DocType` column already existed in all three sheets.

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `doGet()` dispatch entries from `AppScript.txt` into your Google Apps Script project's `doGet()` function (after the `getJournalVoucherReport` branch).
2. Copy the 8 `handle*BankReceiptVoucher*Get(e)` handler functions into the project.
3. Copy the **modified** JV handlers (`handleGetJournalVouchersGet` and `handleGetJournalVoucherReportGet`) so the shared-sheet `DocType = 'JV'` filtering is active.
4. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `bankreceiptvoucherform.htm` (new)
- `bankreceiptvoucherlist.htm` (new)
- `bankreceiptvoucherprint.htm` (new)
- `bankreceiptvoucherreport.htm` (new)
- `api.js` (updated)

### 4. Add Menu Entries
To make the BRV pages accessible through the navigation menu:

1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet** - go to the **MenuMaster** tab and add rows in the same group as the Journal Voucher menus (use the next available MenuIds):
   ```
   MenuId: <next available ID>
   ParentMenuId: <same parent as the Journal Voucher menus>
   MenuType: P (for Page)
   MenuName: Bank Receipt Voucher
   PageUrl: bankreceiptvoucherform.htm
   SortOrder: <your preferred order, e.g., right after the JV menus>
   ```
   Repeat for the List and Report pages:
   - MenuName: `Bank Receipt Voucher List`, PageUrl: `bankreceiptvoucherlist.htm`
   - MenuName: `Bank Receipt Voucher Report`, PageUrl: `bankreceiptvoucherreport.htm`

3. **Grant Admin Access** - go to the **RoleMenuAccess** tab and add rows for each new MenuId:
   ```
   RoleId: 1 (or your Admin role ID)
   MenuId: <the MenuId you created above>
   ```

4. Logout and login again to refresh menu permissions.

## API Endpoints

### Get Bank Receipt Vouchers (paginated list)
```
GET ?action=getBankReceiptVouchers&sessionId={sessionId}&userId={userId}&page={page}&pageSize={pageSize}&search={search}&callback={callback}
```

### Get Bank Receipt Voucher by DocNo
```
GET ?action=getBankReceiptVoucherByDocNo&sessionId={sessionId}&userId={userId}&docNo={docNo}&callback={callback}
```
**Response:** `{ "status": "success", "jv": { "header": {...}, "details": [...] } }`

### Create Bank Receipt Voucher
```
GET ?action=createBankReceiptVoucher&sessionId={sessionId}&userId={userId}&brvData={json}&callback={callback}
```
`brvData` shape (same as JV):
```json
{
  "header": { "docType": "BRV", "docNo": null, "date": "2026-08-11", "narration": "...", "debit": 100, "credit": 100, "refNo": "", "refDate": "" },
  "details": [
    { "docSrNo": 1, "acCode": "...", "acDescription": "...", "subledger": "", "amount": -100, "narration": "", "mode": "CHEQUE", "bank": "...", "instrumentNo": "...", "instrumentDate": "" },
    { "docSrNo": 2, "acCode": "...", "acDescription": "...", "subledger": "", "amount": 100, "narration": "", "mode": "", "bank": "", "instrumentNo": "", "instrumentDate": "" }
  ]
}
```
**Response:** `{ "status": "success", "message": "Bank Receipt Voucher created successfully", "docNo": "BRV1001" }`

### Update / Delete / Post / Cancel Post
- `updateBankReceiptVoucher` - same body as create; requires `header.docNo`
- `deleteBankReceiptVoucher` - `docNo` param (blocked if already posted)
- `postBRVToAccountTransaction` - `docNo` param; writes `AccountTransaction` rows with `DocType = 'BRV'`
- `cancelBRVAccountTransactionPost` - `docNo` param; deletes those `AccountTransaction` rows and clears posted status

### Get Bank Receipt Voucher Report
```
GET ?action=getBankReceiptVoucherReport&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&reportType={headerwise|linewise}&callback={callback}
```
**Response:** `{ "status": "success", "jv": [...], "reportType": "...", "summary": { "totalCount": n, "totalDebit": n, "totalCredit": n } }`

## Frontend Features
- **Form**: DocNo (auto-generated, disabled), Date, Narration, Reference No/Date, Created By/Time; detail lines with Debit/Credit type, searchable GL account, description, subledger (AP/AR-aware), amount, line narration, Mode (CASH/CHEQUE/ONLINE/BANK/OTHERS), Bank, Instrument No/Date. Live balance check (Debit must equal Credit). Actions: Save/Update, View, Edit, Delete, Print, Post, Cancel Post, Accounting Entry modal.
- **List**: pagination, search by DocNo/Narration/Date, and per-row view/edit/delete/post/cancel-post actions.
- **Print**: A4 layout with company logo/name, "BANK RECEIPT VOUCHER" title, entries table, totals, amount in words, signature blocks.
- **Report**: date-range filter, headerwise/linewise modes, summary totals, CSV export.

## Verification Checklist
- [ ] Deployed Apps Script new version; `API_URL` in `api.js` updated
- [ ] Uploaded the 4 new BRV pages and updated `api.js` to web hosting
- [ ] Added 3 MenuMaster rows (Form / List / Report) + RoleMenuAccess grants for Admin
- [ ] Created a BRV - docNo shows as `BRV1001`; header + details saved with `DocType = BRV`
- [ ] Edited the BRV; confirmed changes persist
- [ ] Printed the BRV; print title shows "BANK RECEIPT VOUCHER"
- [ ] Ran the BRV report (headerwise + linewise + CSV)
- [ ] Posted the BRV; verified `AccountTransaction` rows with `DocType = BRV`
- [ ] Cancelled the post; verified entries removed and posted status cleared
- [ ] Deleted the BRV (unposted); verified header + details removed
- [ ] **JV regression check**: JV list and JV report show ONLY `JV` records (no BRV rows)
- [ ] Trial Balance / Statement of Account include posted BRV amounts

## Allocation (AR / AP) - added with the Allocation module
- The BRV entry grid has a new **Allocation** column. It is active only for accounts that have a
  subledger (`COA.SUBLEDGER_EXISTS = 1` and `COA.ACTYPE_DOCNO = AR`), i.e. the customer line of the
  voucher, and only after the customer has been selected.
- `🔗 Allocate` opens a modal with the pending Sales Invoices (SI) of that customer
  (`AccountTransaction` rows with the same `AC_DOCNO` + `SUBLEDGER_DOCNO` and a remaining `BAL_AMOUNT`),
  where the BRV amount can be applied to one or more invoices (partial allocation is allowed).
- The allocation is saved with the voucher in the new `JournalVoucherDetails` column
  `AllocationJSON` (M). It is written to the **Allocation** sheet and `BAL_AMOUNT` is updated on both
  sides (BRV AR line `+=`, invoice AR line `-=`) when the voucher is **posted**; **Cancel Post**
  removes the Allocation rows and restores the invoice balances.
- New API functions: `apiGetAllocationOutstanding()` and `apiGetVoucherAllocations()`.
  See **ALLOCATION_DEPLOYMENT.md** for the full guide.

