# Profit and Loss Report Deployment Guide

## Overview
A new **Profit and Loss (P&L) Statement** form has been added, modeled after the existing Trial Balance report. It shows income and expense account movements for a selected date range and computes the net profit / net loss.

## Files Created/Modified

### New Files:
1. **profitandloss.htm** - Frontend P&L report page (filters, expandable COA tree view, summary cards, CSV export)
2. **PROFIT_LOSS_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 1 API function: `apiGetProfitAndLoss(filters, callback)`
2. **AppScript.txt** -
   - Added dispatch entry in `doGet()` for: `getProfitAndLoss`
   - Added handler function: `handleGetProfitAndLossGet(e)`

## How P&L Accounts Are Determined
Accounts are classified by their `FIRST_LEVEL` value in the COA sheet (resolved by walking the parent chain to the top-level account that carries the classification):
- `4` = INCOME -> shown in the Income section (Net Income = Credit - Debit)
- `5` = EXPENSE -> shown in the Expense section (Net Expense = Debit - Credit)

Only GL (posting) accounts are reported, using the same conventions as the Trial Balance report.

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the new `getProfitAndLoss` dispatch entry from `AppScript.txt` into your Google Apps Script project's `doGet()` function.
2. Copy the `handleGetProfitAndLossGet(e)` function into the project.
3. Deploy the Apps Script project (new version) and copy the Web App URL.

### 2. Update api.js
1. Verify `API_URL` in `api.js` points to the newly deployed Web App URL.

### 3. Upload Frontend Files
Upload these files to your web hosting:
- `profitandloss.htm` (new file)
- `api.js` (updated)

### 4. Add Menu Entry
To make the Profit and Loss page accessible through the navigation menu:

1. **Open your Google Sheet:**
   - Sheet ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`

2. **Add to MenuMaster sheet:**
   - Go to the **MenuMaster** tab
   - Add a new row (use the next available MenuId) in the same group as the Trial Balance menu:
     ```
     MenuId: <next available ID>
     ParentMenuId: <same parent as the Trial Balance menu>
     MenuType: P (for Page)
     MenuName: Profit and Loss
     PageUrl: profitandloss.htm
     SortOrder: <your preferred order, e.g., right after Trial Balance>
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

### Get Profit and Loss Report
```
GET ?action=getProfitAndLoss&sessionId={sessionId}&userId={userId}&fromDate={yyyy-MM-dd}&toDate={yyyy-MM-dd}&callback={callback}
```

**Response:**
```json
{
  "status": "success",
  "rows": [
    { "type": "group", "level": 1, "docno": 4, "parent": 0, "acCode": "", "description": "INCOME", "section": "income", "totalDebit": 0, "totalCredit": 0, "netDebit": 0, "netCredit": 0, "pnlAmount": 0, "hasChildren": true },
    { "type": "ledger", "level": 2, "docno": 41, "parent": 4, "acCode": "4100001", "description": "Sales Revenue", "section": "income", "totalDebit": 0, "totalCredit": 10000, "netDebit": 0, "netCredit": 10000, "pnlAmount": 10000, "hasChildren": false }
  ],
  "summary": {
    "incomeAccounts": 5,
    "expenseAccounts": 8,
    "totalIncome": 50000,
    "totalExpenses": 32000,
    "netProfit": 18000,
    "isProfit": true
  },
  "fromDate": "2026-01-01",
  "toDate": "2026-12-31"
}
```

## Frontend Features

### Filters
- From Date / To Date
- Hide zero balance accounts toggle

### Report Layout
- Income section (green header) - INCOME (FIRST_LEVEL = 4) ledgers, Net Income = Credit - Debit
- Expense section (red header) - EXPENSE (FIRST_LEVEL = 5) ledgers, Net Expense = Debit - Credit
- Expandable/collapsible COA tree, same behavior as Trial Balance
- Summary cards: Total Income, Total Expenses, Net Profit/(Loss), Status
- Net Profit / Net Loss status banner
- CSV export
