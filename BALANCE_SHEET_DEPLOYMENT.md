# Balance Sheet Deployment Guide

## Overview
A new **Balance Sheet** report form has been added, modeled after the Trial Balance and Profit and Loss reports. It shows period movements for asset, liability and equity accounts in three sections, plus the Net Profit/(Loss) for the period, and reports whether the statement balances.

## Files Created/Modified

### New Files:
1. **balancesheet.htm** - Frontend balance sheet report page (filters, three-section expandable COA tree, summary cards, CSV export)
2. **BALANCE_SHEET_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 1 API function: `apiGetBalanceSheet(filters, callback)`
2. **AppScript.txt** -
   - Added dispatch entry in `doGet()` for: `getBalanceSheet`
   - Added handler function: `handleGetBalanceSheetGet(e)`

## How Balance Sheet Accounts Are Determined
Accounts are classified by their `FIRST_LEVEL` value in the COA sheet (resolved by walking the parent chain to the top-level account that carries the classification):
- `1` = ASSET -> Assets section (debit normal balance)
- `2` = LIABILITY -> Liabilities section (credit normal balance)
- `3` = EQUITY -> Equity section (credit normal balance)

The **Net Profit/(Loss) for the Period** is computed from the P&L accounts (FIRST_LEVEL 4 = INCOME, 5 = EXPENSE) for the same date range and added under Equity so the statement balances.

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `getBalanceSheet` dispatch entry from `AppScript.txt` into your Google Apps Script project's `doGet()` function.
2. Copy the `handleGetBalanceSheetGet(e)` function into the project.
3. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `balancesheet.htm` (new file)
- `api.js` (updated)

### 4. Add Menu Entry
1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet:**
   - Go to the **MenuMaster** tab
   - Add a new row (use the next available MenuId) in the same group as the Trial Balance / Profit and Loss menus:
     ```
     MenuId: <next available ID>
     ParentMenuId: <same parent as Trial Balance / Profit and Loss menu>
     MenuType: P (for Page)
     MenuName: Balance Sheet
     PageUrl: balancesheet.htm
     SortOrder: <your preferred order>
     ```

3. **Grant Admin Access:**
   - Go to the **RoleMenuAccess** tab
   - Add a new row:
     ```
     RoleId: 1 (or your Admin role ID)
     MenuId: <the MenuId you created above>
     ```

4. Logout and login again to refresh menu permissions.

## API Endpoint

### Get Balance Sheet Report
```
GET ?action=getBalanceSheet&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&callback={callback}
```

**Response:**
```json
{
  "status": "success",
  "rows": [
    { "type": "group", "level": 1, "docno": 1, "parent": 0, "acCode": "", "description": "ASSETS", "section": "asset", "totalDebit": 0, "totalCredit": 0, "netDebit": 0, "netCredit": 0, "hasChildren": true },
    { "type": "ledger", "level": 2, "docno": 11, "parent": 1, "acCode": "1010001", "description": "Cash", "section": "asset", "totalDebit": 50000, "totalCredit": 30000, "netDebit": 20000, "netCredit": 0, "hasChildren": false }
  ],
  "summary": {
    "assetAccounts": 5,
    "liabilityAccounts": 3,
    "equityAccounts": 2,
    "totalAssets": 20000,
    "totalLiabilities": 8000,
    "totalEquity": 10000,
    "netProfit": 2000,
    "totalLiabilitiesEquity": 20000,
    "difference": 0,
    "balanced": true
  },
  "fromDate": "2026-01-01",
  "toDate": "2026-12-31"
}
```

## Frontend Features

### Filters
- From Date / To Date
- Hide zero balance accounts toggle
- Display Mode: With GL Account / Only Group Total (No Ledger Account)

### Report Layout
- Assets section (cyan header) - FIRST_LEVEL = 1
- Liabilities section (orange header) - FIRST_LEVEL = 2
- Equity section (purple header) - FIRST_LEVEL = 3
- Expandable/collapsible COA tree, same behavior as Trial Balance
- Net Profit/(Loss) for the Period shown in the Equity section footer
- Summary cards: Total Assets, Total Liabilities, Total Equity, Net Profit/(Loss), Status
- Balanced / Unbalanced status banner
- CSV export
