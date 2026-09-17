# Bank Payment Voucher (BPV) Deployment Guide

## Overview
A new **Bank Payment Voucher (BPV)** module has been added, modeled exactly on the existing **Journal Voucher (JV)** module. It provides a full voucher lifecycle: form entry, list, A4 print, and a date-range report. BPV records are stored in the **same** `JournalVoucherHeader` / `JournalVoucherDetails` sheets as JV records, distinguished by the **`DocType`** column (`BPV`). Posting writes to the shared `AccountTransaction` sheet with `DocType = BPV`, so existing reports (Trial Balance, P&L, Balance Sheet, Statement of Account) pick up BPV entries automatically.

Document numbers use the `BPV` prefix and continue the existing numbering convention: `BPV1001`, `BPV1002`, ...

## Files Created/Modified

### New Files:
1. **bankpaymentvoucherform.htm** - BPV entry form (header fields + detail lines with Debit/Credit, Mode, Bank, Instrument No/Date; view/edit/post/cancel-post/print/accounting-entry actions)
2. **bankpaymentvoucherlist.htm** - BPV list with server-side pagination, search, and actions (view/edit/delete/post/cancel post)
3. **bankpaymentvoucherprint.htm** - A4 print layout ("BANK PAYMENT VOUCHER")
4. **bankpaymentvoucherreport.htm** - BPV date-range report (headerwise / linewise) with CSV export
5. **BANK_PAYMENT_VOUCHER_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 8 BPV API functions:
   - `apiGetBankPaymentVouchers(page, pageSize, search, callback)`
   - `apiGetBankPaymentVoucherByDocNo(docNo, callback)`
   - `apiCreateBankPaymentVoucher(bpvData, callback)` (30s timeout, like JV create)
   - `apiUpdateBankPaymentVoucher(bpvData, callback)`
   - `apiDeleteBankPaymentVoucher(docNo, callback)`
   - `apiPostBPVToAccountTransaction(docNo, callback)`
   - `apiCancelBPVAccountTransactionPost(docNo, callback)`
   - `apiGetBankPaymentVoucherReport(filters, callback)`

2. **AppScript.txt** -
   - Added dispatch entries in `doGet()` for: `getBankPaymentVouchers`, `getBankPaymentVoucherByDocNo`, `createBankPaymentVoucher`, `updateBankPaymentVoucher`, `deleteBankPaymentVoucher`, `postBPVToAccountTransaction`, `cancelBPVAccountTransactionPost`, `getBankPaymentVoucherReport`
   - Added handler functions:
     - `handleGetBankPaymentVouchersGet(e)`
     - `handleGetBankPaymentVoucherByDocNoGet(e)`
     - `handleCreateBankPaymentVoucherGet(e)`
     - `handleUpdateBankPaymentVoucherGet(e)`
     - `handleDeleteBankPaymentVoucherGet(e)`
     - `handlePostBPVToAccountTransactionGet(e)`
     - `handleCancelBPVAccountTransactionPostGet(e)`
     - `handleGetBankPaymentVoucherReportGet(e)`
   - **No changes to existing JV/BRV/CRV handlers are required** - JV handlers filter `DocType = 'JV'`, BRV handlers filter `DocType = 'BRV'`, and CRV handlers filter `DocType = 'CRV'`, so BPV rows are automatically excluded from their lists/reports.

## How BPV Storage Works
- **JournalVoucherHeader** - one row per BPV header: `DocType` (`BPV`), `DocNo` (`BPV1001`, ...), `Date`, `Narration`, `Debit`, `Credit`, `RefNo`, `RefDate`, `CreatedBy`, `CreatedTime`, `PostedBy`, `PostedTime`
- **JournalVoucherDetails** - one row per BPV detail line: `DocType` (`BPV`), `DocNo`, `DocSrNo`, `ACCode`, `ACDescription`, `Subledger`, `Amount` (negative = debit, positive = credit), `Narration`, `Mode`, `Bank`, `InstrumentNo`, `InstrumentDate`
- **AccountTransaction** - created on Post with `DocType = 'BPV'`, exactly like JV/Sales/Opening Stock entries. Cancel Post deletes only `BPV` rows for the document.
- **No new sheets are required.** The `DocType` column already existed in all three sheets.

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `doGet()` dispatch entries from `AppScript.txt` into your Google Apps Script project's `doGet()` function (after the `getCashReceiptVoucherReport` branch).
2. Copy the 8 `handle*BankPaymentVoucher*Get(e)` handler functions into the project.
3. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `bankpaymentvoucherform.htm` (new)
- `bankpaymentvoucherlist.htm` (new)
- `bankpaymentvoucherprint.htm` (new)
- `bankpaymentvoucherreport.htm` (new)
- `api.js` (updated)

### 4. Add Menu Entries
To make the BPV pages accessible through the navigation menu:

1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet** - go to the **MenuMaster** tab and add rows in the same group as the Journal Voucher / Bank Receipt Voucher / Cash Receipt Voucher menus (use the next available MenuIds):
   ```
   MenuId: <next available ID>
   ParentMenuId: <same parent as the Journal Voucher menus>
   MenuType: P (for Page)
   MenuName: Bank Payment Voucher
   PageUrl: bankpaymentvoucherform.htm
   SortOrder: <your preferred order, e.g., right after the CRV menus>
   ```
   Repeat for the List and Report pages:
   - MenuName: `Bank Payment Voucher List`, PageUrl: `bankpaymentvoucherlist.htm`
   - MenuName: `Bank Payment Voucher Report`, PageUrl: `bankpaymentvoucherreport.htm`

3. **Grant Admin Access** - go to the **RoleMenuAccess** tab and add rows for each new MenuId:
   ```
   RoleId: 1 (or your Admin role ID)
   MenuId: <the MenuId you created above>
   ```

4. Logout and login again to refresh menu permissions.

## API Endpoints

### Get Bank Payment Vouchers (paginated list)
```
GET ?action=getBankPaymentVouchers&sessionId={sessionId}&userId={userId}&page={page}&pageSize={pageSize}&search={search}&callback={callback}
```

### Get Bank Payment Voucher by DocNo
```
GET ?action=getBankPaymentVoucherByDocNo&sessionId={sessionId}&userId={userId}&docNo={docNo}&callback={callback}
```
**Response:** `{ "status": "success", "jv": { "header": {...}, "details": [...] } }`

### Create Bank Payment Voucher
```
GET ?action=createBankPaymentVoucher&sessionId={sessionId}&userId={userId}&bpvData={json}&callback={callback}
```
`bpvData` shape (same as JV):
```json
{
  "header": { "docType": "BPV", "docNo": null, "date": "2026-08-11", "narration": "...", "debit": 100, "credit": 100, "refNo": "", "refDate": "" },
  "details": [
    { "docSrNo": 1, "acCode": "...", "acDescription": "...", "subledger": "", "amount": -100, "narration": "", "mode": "CHEQUE", "bank": "...", "instrumentNo": "...", "instrumentDate": "" },
    { "docSrNo": 2, "acCode": "...", "acDescription": "...", "subledger": "", "amount": 100, "narration": "", "mode": "", "bank": "", "instrumentNo": "", "instrumentDate": "" }
  ]
}
```
**Response:** `{ "status": "success", "message": "Bank Payment Voucher created successfully", "docNo": "BPV1001" }`

### Update / Delete / Post / Cancel Post
- `updateBankPaymentVoucher` - same body as create; requires `header.docNo`
- `deleteBankPaymentVoucher` - `docNo` param (blocked if already posted)
- `postBPVToAccountTransaction` - `docNo` param; writes `AccountTransaction` rows with `DocType = 'BPV'`
- `cancelBPVAccountTransactionPost` - `docNo` param; deletes those `AccountTransaction` rows and clears posted status

### Get Bank Payment Voucher Report
```
GET ?action=getBankPaymentVoucherReport&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&reportType={headerwise|linewise}&callback={callback}
```
**Response:** `{ "status": "success", "jv": [...], "reportType": "...", "summary": { "totalCount": n, "totalDebit": n, "totalCredit": n } }`

## Frontend Features
- **Form**: DocNo (auto-generated, disabled), Date, Narration, Reference No/Date, Created By/Time; detail lines with Debit/Credit type, searchable GL account, description, subledger (AP/AR-aware), amount, line narration, Mode (CASH/CHEQUE/ONLINE/BANK/OTHERS), Bank, Instrument No/Date. Live balance check (Debit must equal Credit). Actions: Save/Update, View, Edit, Delete, Print, Post, Cancel Post, Accounting Entry modal.
- **List**: pagination, search by DocNo/Narration/Date, and per-row view/edit/delete/post/cancel-post actions.
- **Print**: A4 layout with company logo/name, "BANK PAYMENT VOUCHER" title, entries table, totals, amount in words, signature blocks.
- **Report**: date-range filter, headerwise/linewise modes, summary totals, CSV export.

## Verification Checklist
- [ ] Deployed Apps Script new version; `API_URL` in `api.js` updated
- [ ] Uploaded the 4 new BPV pages and updated `api.js` to web hosting
- [ ] Added 3 MenuMaster rows (Form / List / Report) + RoleMenuAccess grants for Admin
- [ ] Created a BPV - docNo shows as `BPV1001`; header + details saved with `DocType = BPV`
- [ ] Edited the BPV; confirmed changes persist
- [ ] Printed the BPV; print title shows "BANK PAYMENT VOUCHER"
- [ ] Ran the BPV report (headerwise + linewise + CSV)
- [ ] Posted the BPV; verified `AccountTransaction` rows with `DocType = BPV`
- [ ] Cancelled the post; verified entries removed and posted status cleared
- [ ] Deleted the BPV (unposted); verified header + details removed
- [ ] **JV regression check**: JV list and JV report show ONLY `JV` records (no BPV rows)
- [ ] **BRV regression check**: BRV list and BRV report show ONLY `BRV` records (no BPV rows)
- [ ] **CRV regression check**: CRV list and CRV report show ONLY `CRV` records (no BPV rows)
- [ ] Trial Balance / Statement of Account include posted BPV amounts

## Allocation (AR / AP) - added with the Allocation module
- The BPV entry grid has a new **Allocation** column. It is active only for accounts that have a
  subledger (`COA.SUBLEDGER_EXISTS = 1` and `COA.ACTYPE_DOCNO = AP`), i.e. the supplier line of the
  voucher, and only after the supplier has been selected.
- `🔗 Allocate` opens a modal with the pending Purchase Invoices (PI) of that supplier
  (`AccountTransaction` rows with the same `AC_DOCNO` + `SUBLEDGER_DOCNO` and a remaining `BAL_AMOUNT`),
  where the BPV amount can be applied to one or more invoices (partial allocation is allowed).
- The allocation is saved with the voucher in the new `JournalVoucherDetails` column
  `AllocationJSON` (M). It is written to the **Allocation** sheet and `BAL_AMOUNT` is updated on both
  sides (BPV AP line `+=`, invoice AP line `-=`) when the voucher is **posted**; **Cancel Post**
  removes the Allocation rows and restores the invoice balances.
- New API functions: `apiGetAllocationOutstanding()` and `apiGetVoucherAllocations()`.
  See **ALLOCATION_DEPLOYMENT.md** for the full guide.

