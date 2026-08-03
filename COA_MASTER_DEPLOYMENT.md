# Chart of Accounts (COA) Master Deployment Guide

## Files Created/Modified

### New Files:
1. **coamaster.htm** - Frontend page with tree-view hierarchy for managing Chart of Accounts
2. **COA_MASTER_DEPLOYMENT.md** - This deployment guide

### Modified Files:
1. **api.js** - Added 4 API functions: `apiGetCOA`, `apiCreateCOA`, `apiUpdateCOA`, `apiDeleteCOA`
2. **AppScript.txt** - 
   - Added 4 dispatch entries in `doGet()` for: `getCOA`, `createCOA`, `updateCOA`, `deleteCOA`
   - Added 4 handler functions: `handleGetCOAGet`, `handleCreateCOAGet`, `handleUpdateCOAGet`, `handleDeleteCOAGet`

## Deployment Steps

### 1. Update Google Apps Script
1. Copy the COA handler functions from `AppScript.txt` into your Google Apps Script project
2. Copy the `doGet` dispatch entries for COA actions (getCOA, createCOA, updateCOA, deleteCOA)
3. Deploy the Apps Script project

### 2. Update Google Sheet
The system will auto-create a sheet named **"COA"** with the following columns:
| Column | Header | Description |
|--------|--------|-------------|
| A | AC_CODE | Account Code (e.g., 1010101) |
| B | AC_TYPE | Account Type (GL = Ledger/Posting account, blank = Group/Header account) |
| C | DESCRIPTION | Account Name/Description |
| D | LEVEL | Hierarchy Level (1-5) |
| E | PARENT | Parent DOCNO (0 = root) |
| F | DOCNO | Document Number (auto-generated) |
| G | FIRST_LEVEL | Top-level classification |
| H | BALANCE_SHEET_ACCOUNT | 0=No, 1=Yes |
| I | SUBLEDGER_EXISTS | 0=None, 1=Exists |
| J | DOC_SRNO | Document Serial Number |
| K | CREATED_BY | Creator username |
| L | CREATED_TS | Created timestamp |
| M | REMARKS | Optional remarks |
| N | ACTYPE_DOCNO | Subledger Type (GL, AR, AP, BK) |
| O | DEFAULT_BALANCE_SIGN | -1=Debit, 1=Credit |
| P | SRNO | Serial Number (auto-generated) |

### 3. Seed the COA Sheet with Sample Data
After the sheet is created, paste the sample COA data starting from row 2 (row 1 is headers).

### 4. Add Menu Entry
Add a menu entry in the **MenuMaster** sheet for the COA page:
- **Menu Name**: Chart of Accounts
- **Page URL**: coamaster.htm
- **Menu Type**: P (Page)
- **Sort Order**: (appropriate position in Accounting section)

## API Endpoints

### Get All Accounts
```
GET ?action=getCOA&sessionId={sessionId}&userId={userId}&callback={callback}
```

### Create Account
```
GET ?action=createCOA&sessionId={sessionId}&userId={userId}&accountData={JSON}&callback={callback}
```

### Update Account
```
GET ?action=updateCOA&sessionId={sessionId}&userId={userId}&accountData={JSON}&callback={callback}
```

### Delete Account
```
GET ?action=deleteCOA&sessionId={sessionId}&userId={userId}&srno={srno}&callback={callback}
```

## Frontend Features

### Tree View
- Hierarchical display with expand/collapse
- Color-coded by hierarchy level
- Type badges (Ledger vs Group, colored by FIRST_LEVEL classification)
- Subledger badges (GL, AR, AP, BK)

### Filter Tabs
- All, Assets, Liabilities, Equity, Income, Expenses

### CRUD Operations
- Add new account with validation
- Edit existing account (preserves DOCNO, SRNO, CreatedBy, CreatedTs)
- Delete account (checks for child accounts)
- View account details in modal