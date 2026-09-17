# Document Allocation (AR / AP) Deployment Guide

## Overview
The **Allocation** module lets the four receipt/payment vouchers (BRV, CRV, BPV, CPV) settle their
AR/AP control line against the pending invoices of the selected party:

- an **AR** line (customer subledger) is allocated against pending **Sales Invoices (SI)**
- an **AP** line (supplier subledger) is allocated against pending **Purchase Invoices (PI)**

Allocation is possible **only for accounts that have a subledger** - it is driven by the COA master:

| COA column | Meaning for allocation |
|---|---|
| `SUBLEDGER_EXISTS` (I) | must be `1` |
| `ACTYPE_DOCNO` (N) | `AR` = customer (invoices SI), `AP` = supplier (invoices PI); `GL`/`BK`/blank = no allocation |

The pending documents are read from `AccountTransaction` for the voucher line's account code +
subledger (`AC_DOCNO` / `SUBLEDGER_DOCNO`) where `BAL_AMOUNT` is still outstanding.

### Which documents can be allocated?
| Situation | Target documents |
|---|---|
| Account type `AR` (default) | Sales Invoices (`SI`) of the same AR account + customer |
| Account type `AP` (default) | Purchase Invoices (`PI`) of the same AP account + supplier |
| `AllocationAllowVoucherDocs = 1` (SystemParameters) | the above **plus** the other ledger lines of the same account + subledger: `CRV`, `BRV`, `CPV`, `BPV`, `JV` (unapplied receipts / payments, journal lines) |

Two safety rules always apply:
1. **Balance direction** – a target is listed only when its `BAL_AMOUNT` has the **opposite** direction of the
   voucher line's amount (a receipt/credit settles a debit line, a payment/debit settles a credit line), so an
   allocation can never *increase* a balance instead of settling it.
2. **No self allocation** – the voucher being edited is never listed as its own target.

To enable the voucher documents: add a row to the **SystemParameters** sheet with the code
`AllocationAllowVoucherDocs` and the value `1` (absent or any other value = disabled, the default).

### Party rule
The target list is **strictly limited to the same party** (`SubledgerDocNo`) by default: a receipt can only
settle documents of its own customer, a payment only those of its own supplier. Add the SystemParameters row
`AllocationStrictParty` = `0` to allow any party of the same account (the voucher line's party is then only
informational). When the list is empty but other parties have matching documents, the modal lists them so the
mismatch is visible immediately.

Parameter summary (SystemParameters):

| Parameter code | Value | Effect |
|---|---|---|
| `AllocationAllowVoucherDocs` | `1` / `Y` / `YES` / `TRUE` / `ON` | voucher + JV lines (CRV, BRV, CPV, BPV, JV) become valid targets |
| `AllocationStrictParty` | `0` / `N` / `NO` / `FALSE` / `OFF` | disables the same-party rule (any party of the account) |

Both parameters are matched ignoring spaces/case in the code cell and are off (default behaviour) when absent.

## Files Created/Modified

### New Files
1. **ALLOCATION_DEPLOYMENT.md** - this guide

### Modified Files
1. **AppScript.txt** - new "DOCUMENT ALLOCATION (AR / AP) HANDLERS" section + wiring in the 4 voucher handlers:
   - `ensureAllocationSheet(ss)` - creates the `Allocation` sheet with its 11 headers
   - `ensureDetailAllocationColumn(ss, detailsSheet)` - adds the `AllocationJSON` column (M) to `JournalVoucherDetails`
   - `getAllocationAccountMeta()` / `getAllocationPolicy()` - COA driven eligibility (AR/AP + subledger)
   - `getOutstandingDocsForParty()` - pending SI/PI documents of a party from `AccountTransaction.BAL_AMOUNT`
   - `getAllocationDraftsForVoucher()` / `saveAllocationDraftsToSheet()` - pending (unposted) allocations per voucher line
   - `validateAllocationSet()` - server side validation (account, subledger, line amount, invoice balance)
   - `applyVoucherAllocations()` - writes the `Allocation` rows and updates `BAL_AMOUNT`, called by the 4 post handlers
   - `reverseVoucherAllocations()` - deletes the `Allocation` rows and restores `BAL_AMOUNT`, called by the 4 cancel post handlers
   - `handleGetAllocationOutstandingGet(e)` - action `getAllocationOutstanding`
   - `handleGetVoucherAllocationsGet(e)` - action `getVoucherAllocations`
   - create/update handlers of BRV/CRV/BPV/CPV validate and store the allocations (`saveAllocationDraftsToSheet`)
   - post handlers of BRV/CRV/BPV/CPV validate before posting and return `allocatedRows` / `allocatedAmount`
   - `handleGetStatementOfAccountGet` - each entry now returns `balanceAmount` / `outstanding` and the summary
     returns `totalOutstanding` / `pendingBills`
2. **api.js** - added `apiGetAllocationOutstanding(params, callback)` and `apiGetVoucherAllocations(docType, docNo, callback)`
3. **bankreceiptvoucherform.htm**, **cashreceiptvoucherform.htm**, **bankpaymentvoucherform.htm**,
   **cashpaymentvoucherform.htm** - new `Allocation` column in the entry grid, the allocation modal, COA driven
   subledger handling (`getSubledgerInfo()` replaced the account-code prefix heuristic) and allocation details
   in the save payload
4. **statementofaccount.htm** - new `Outstanding` column, `Outstanding` summary card and CSV column
5. **CASH_RECEIPT_VOUCHER_DEPLOYMENT.md**, **BANK_RECEIPT_VOUCHER_DEPLOYMENT.md**,
   **CASH_PAYMENT_VOUCHER_DEPLOYMENT.md**, **BANK_PAYMENT_VOUCHER_DEPLOYMENT.md** - allocation notes

## Google Sheets Structure

### Allocation sheet (posted allocation rows)
| Column | Description |
|---|---|
| FromDocType | Voucher document type (`BRV` / `CRV` / `BPV` / `CPV`) |
| FromDocNo | Voucher number (e.g. `CRV1001`) |
| FromDocSrNo | `DOCSRNO` of the voucher's AR/AP line in `AccountTransaction` |
| FromDocSrSrNo | Split serial of that line (1, 2, 3 ... one per allocated invoice) |
| AccountType | `AR` or `AP` (COA `ACTYPE_DOCNO` of the voucher line) |
| SubledgerDocNo | Customer / supplier code of the voucher line |
| ToDocType | `SI` (for AR) or `PI` (for AP) |
| ToDocNo | Invoice number (e.g. `SI10033`) |
| ToDocSrNo | `DOCSRNO` of the invoice's AR/AP line in `AccountTransaction` |
| ToDocSrSrNo | Split serial on the invoice side (1, 2, 3 ... per allocation row of that invoice line) |
| Amount | Signed amount: negative for receipts (BRV/CRV), positive for payments (BPV/CPV) |

Example:

| FromDocType | FromDocNo | FromDocSrNo | FromDocSrSrNo | AccountType | SubledgerDocNo | ToDocType | ToDocNo | ToDocSrNo | ToDocSrSrNo | Amount |
|---|---|---|---|---|---|---|---|---|---|---|
| CRV | CRV1001 | 2 | 1 | AR | CUST10001 | SI | SI10033 | 1 | 1 | -26.25 |
| CPV | CPV1002 | 2 | 1 | AP | SUPP10001 | PI | PI10003 | 3 | 1 | 100 |

### JournalVoucherDetails - new column M `AllocationJSON`
Allocations are entered with the voucher (before it is posted) and are kept as JSON in the new
trailing `AllocationJSON` column of `JournalVoucherDetails` (JV/BRV/CRV/BPV/CPV all share this
sheet; JV simply leaves the column empty). The `Allocation` sheet therefore contains **posted
allocations only**.

Example cell value:

```json
[{"toDocType":"SI","toDocNo":"SI10033","toDocSrNo":1,"amount":26.25}]
```

### AccountTransaction.BAL_AMOUNT
`BAL_AMOUNT` is written at insert time (= `AMOUNT`) and is then maintained by the allocation:

```
From line (voucher AR credit / AP debit) :  BAL_AMOUNT += Amount
To line   (invoice AR debit  / AP credit):  BAL_AMOUNT -= Amount
```

`AR` balances are negative (receivable) and `AP` balances are positive (payable). Example with the
data above:

| Document | Line | BAL_AMOUNT before | after |
|---|---|---|---|
| CRV1001 | AR / CUST10001 | +100.00 | +73.75 |
| SI10033 | AR / CUST10001 | -26.25 | 0.00 |
| CPV1002 | AP / SUPP10001 | -100.00 | 0.00 |
| PI10003 | AP / SUPP10001 | +2100.00 | +2000.00 |

Cancelling the post deletes the `Allocation` rows of the voucher and adds the amounts back to the
invoice balances.

## How It Works in the Voucher Forms

1. Add a detail line and select the AR/AP account (any account with `SUBLEDGER_EXISTS = 1` and
   `ACTYPE_DOCNO = AR/AP` now activates the Subledger dropdown - this is COA driven, not based on the
   account code text).
2. Select the **Customer** (AR) or **Supplier** (AP). The **Allocation** cell now shows the
   `🔗 Allocate` button.
3. Click `🔗 Allocate`: a modal lists the pending target documents of that party
   (`SI` for AR, `PI` for AP - plus voucher documents when `AllocationAllowVoucherDocs = 1`)
   with their document amount and outstanding amount.
   - enter the amount per document (capped by the line amount and by the document balance)
   - `⚡ Auto Allocate` fills the oldest documents first (FIFO)
   - `✖ Clear` resets the inputs
   - `💾 Save Allocation` stores the allocation on the line (the grid then shows
     `🔗 2 bills / 26.25` - green when the line is fully allocated, orange when partly allocated)
   - the total of a line may never exceed the line amount, and a document may never be allocated
     more than its outstanding balance
4. Save the voucher. The allocations are stored in `JournalVoucherDetails.AllocationJSON`.
5. Post the voucher: the allocation rows are written to the `Allocation` sheet and `BAL_AMOUNT` is
   updated on both sides. The post message reports how many bills were allocated.
6. Cancel Post removes the allocation rows and restores the invoice balances; the allocation of the
   voucher is kept, so the voucher can be posted again.
7. In view mode (also for a posted voucher) the Allocation button opens the same modal in read-only
   mode, so the allocation can be reviewed.

If a line is not fully allocated, saving the voucher asks for confirmation - the unallocated part
stays as a pending balance of the voucher line (and can be allocated later by editing the voucher).

## API Actions

| Action | Parameters | Description |
|---|---|---|
| `getAllocationOutstanding` | `acCode`, `subledgerDocNo`, `docType`, `docNo`, `fromAmount` (signed amount of the voucher line), `excludeDocType` / `excludeDocNo` (default = the voucher itself), `currentAllocations` | Pending target documents with `outstanding`, `allocated` (not posted yet) and `available`; the response also returns `targetTypes`, `allowVoucherDocs`, `strictParty` and - when the list is empty - up to 5 `similarDocuments` of other parties (same account + direction) so the UI can explain the mismatch |
| `getVoucherAllocations` | `docType`, `docNo` | Saved allocations of a voucher, grouped by detail serial number |

`allocations` are also part of the BRV/CRV/BPV/CPV create/update payload (per detail line).

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `doGet()` dispatch entries (`getAllocationOutstanding`, `getVoucherAllocations`) from
   `AppScript.txt` into your project's `doGet()` (before the `getStatementOfAccount` branch).
2. Copy the new "DOCUMENT ALLOCATION (AR / AP) HANDLERS" section and the changes inside the
   BRV/CRV/BPV/CPV create / update / post / cancel post handlers.
3. Deploy a new version of the Web App and copy the URL (it must match `API_URL` in `api.js`).

### 2. Upload Frontend Files
- `bankreceiptvoucherform.htm`, `cashreceiptvoucherform.htm`, `bankpaymentvoucherform.htm`,
  `cashpaymentvoucherform.htm` (updated)
- `statementofaccount.htm` (updated)
- `api.js` (updated)

No menu entries or new pages are required.

### 3. Prepare the Google Sheet
The `Allocation` sheet must exist with the 11 headers listed above (the backend creates it
automatically if it is missing). The `AllocationJSON` column (M) of `JournalVoucherDetails` is added
automatically the first time an allocation is saved.

## Test Checklist

1. Post a sales invoice (AR): `AccountTransaction` shows the AR line with `BAL_AMOUNT = -26.25`.
2. New CRV: line 1 cash (debit), line 2 the AR account + customer (credit) - the Allocation button is
   active only on line 2 and only after the customer is selected; a GL line shows `—`.
3. `🔗 Allocate` lists the posted invoice with its outstanding amount; allocate the full amount; save.
4. Post the CRV: the `Allocation` row appears (`CRV, CRV1001, 2, 1, AR, CUST..., SI, SI10033, 1, 1, -26.25`)
   and both `BAL_AMOUNT` values become `0.00`.
5. Re-open the allocation modal: the invoice is no longer listed (fully allocated).
6. Cancel Post: the `Allocation` row is removed and the invoice `BAL_AMOUNT` is back to `-26.25`.
7. Partial allocation (10 of 26.25): the invoice keeps `-16.25` and is listed again next time.
8. Repeat for CPV/PI (AP) and for BRV/BPV.
9. Validation: allocating more than the line amount or more than the invoice balance is rejected;
   allocating a GL account, or an AR/AP line without a subledger, is rejected.
10. Statement of Account: the `Outstanding` column shows the pending amount per document and the
    `Outstanding` card shows the total.

## Diagnostics

Run **`ALLOC_DIAGNOSTIC`** from the Apps Script editor (select it in the function dropdown and click
**Run**, then open **Execution log**) whenever the picker looks empty or an allocation is rejected. It is
read only and logs, exactly as the allocation engine reads them:

The allocation modal also explains an empty list itself: it shows the account/subledger it queried, the
direction of the voucher line (only opposite-direction documents are allocatable), the document types the
server looked for and whether voucher documents are enabled - so a screenshot of the modal is usually
enough to tell whether the cause is data, a missing `AllocationAllowVoucherDocs` parameter or a stale
deployment (the message turns red when the server does not report the target types). When other parties have
matching documents, the modal lists them (e.g. *"SI10033 (CUST10001, 26.25)"*), which pinpoints a party
mismatch instantly.

1. every COA account with `SUBLEDGER_EXISTS = 1` (with its `ACTYPE_DOCNO`),
2. every outstanding `DOCTYPE | AC_DOCNO | SUBLEDGER_DOCNO` combination in `AccountTransaction`, each
   marked as *invoice (valid target)* or *voucher/other (target only with `AllocationAllowVoucherDocs = 1`)*,
3. the raw ledger rows (`DOCTYPE | DOCNO | SR | AC | SUBLEDGER | AMOUNT | BAL_AMOUNT | REF_NO`),
4. the voucher lines of `JournalVoucherDetails` including the `AllocationJSON` column M,
5. the current content of the `Allocation` sheet.

Typical findings:
- the party of the invoice differs from the party selected on the voucher line (nothing is listed - by design),
- the invoice is saved but **not posted** (no `AccountTransaction` rows exist yet),
- the account code / subledger cell has a different case or a stray space (handled by the normalization),
- `SUBLEDGER_EXISTS` / `ACTYPE_DOCNO` is not set for the AR/AP account in the COA master.

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| Allocation button stays greyed out | No subledger selected, or the account is not an AR/AP account with `SUBLEDGER_EXISTS = 1` in the COA |
| No pending documents found | Only the **invoices** of the party are targets (`SI` for AR, `PI` for AP) - the voucher's own unapplied balance is a *source*, not a target. Also: the invoice must be **posted** (existence in `AccountTransaction`), must belong to the same account + subledger, and must still have a balance. Run `ALLOC_DIAGNOSTIC` to see the exact rows. Voucher-to-voucher targets need `AllocationAllowVoucherDocs = 1` |
| "does not belong to <subledger>" on post | The invoice belongs to another customer/supplier - allocation is only allowed for the same party |
| "exceeds its outstanding balance" | Another voucher allocated the invoice in the meantime, or the entered amount is higher than the remaining balance |
| Allocation not visible after saving the voucher | The voucher was saved before the updated Apps Script/api.js were deployed |
| "... has the same balance direction as this line and cannot be settled by it" | The selected target has the same debit/credit direction as the voucher line (e.g. a payment trying to settle another payment). Settling requires opposite directions - check the document you picked |
| A voucher line (CRV/BRV/CPV/BPV) is not listed as a target | By design; enable `AllocationAllowVoucherDocs = 1` in **SystemParameters** to allow voucher documents as targets |

