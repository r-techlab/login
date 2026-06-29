# Stock Master Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Stock Master functionality to your Google Apps Script backend.

## Prerequisites
- Access to Google Apps Script project
- StockMaster sheet created in Google Sheets
- Unit Master already deployed and functional

## Google Sheets Setup

### 1. Create StockMaster Sheet
Create a new sheet named **"StockMaster"** with the following columns:

| Column A | Column B | Column C |
|----------|----------|----------|
| Code | Description | UnitCode |

**Column Headers (Row 1):**
- A1: `Code`
- B1: `Description`
- C1: `UnitCode`

### 2. Sheet Structure
- **Code**: Unique identifier for each stock item (e.g., ITEM001, PROD001)
- **Description**: Full description of the stock item
- **UnitCode**: Reference to Unit Master (must exist in UnitMaster sheet)

## Apps Script Backend Code

Add the following code to your Google Apps Script project:

### Stock Master CRUD Functions

```javascript
// ============================================
// STOCK MASTER MANAGEMENT
// ============================================

/**
 * Get all stocks from StockMaster sheet
 */
function getStocks() {
  try {
    const sheet = getSheet('StockMaster');
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse('success', 'No stocks found', { stocks: [] });
    }
    
    const stocks = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) { // Check if Code exists
        stocks.push({
          code: data[i][0],
          description: data[i][1] || '',
          unitCode: data[i][2] || ''
        });
      }
    }
    
    return createResponse('success', 'Stocks retrieved successfully', { stocks: stocks });
  } catch (error) {
    return createResponse('error', 'Error retrieving stocks: ' + error.message);
  }
}

/**
 * Create new stock in StockMaster sheet
 */
function createStock(code, description, unitCode) {
  try {
    // Validate required fields
    if (!code || !description || !unitCode) {
      return createResponse('error', 'Code, Description, and UnitCode are required');
    }
    
    const sheet = getSheet('StockMaster');
    const data = sheet.getDataRange().getValues();
    
    // Check for duplicate code
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toUpperCase() === code.toString().toUpperCase()) {
        return createResponse('error', 'Stock code already exists');
      }
    }
    
    // Validate UnitCode exists in UnitMaster
    const unitSheet = getSheet('UnitMaster');
    const unitData = unitSheet.getDataRange().getValues();
    let unitExists = false;
    for (let i = 1; i < unitData.length; i++) {
      if (unitData[i][0] && unitData[i][0].toString() === unitCode.toString()) {
        unitExists = true;
        break;
      }
    }
    
    if (!unitExists) {
      return createResponse('error', 'Invalid Unit Code. Unit does not exist in Unit Master.');
    }
    
    // Add new stock
    sheet.appendRow([code, description, unitCode]);
    
    return createResponse('success', 'Stock created successfully');
  } catch (error) {
    return createResponse('error', 'Error creating stock: ' + error.message);
  }
}

/**
 * Update existing stock in StockMaster sheet
 */
function updateStock(code, description, unitCode) {
  try {
    // Validate required fields
    if (!code || !description || !unitCode) {
      return createResponse('error', 'Code, Description, and UnitCode are required');
    }
    
    const sheet = getSheet('StockMaster');
    const data = sheet.getDataRange().getValues();
    
    // Validate UnitCode exists in UnitMaster
    const unitSheet = getSheet('UnitMaster');
    const unitData = unitSheet.getDataRange().getValues();
    let unitExists = false;
    for (let i = 1; i < unitData.length; i++) {
      if (unitData[i][0] && unitData[i][0].toString() === unitCode.toString()) {
        unitExists = true;
        break;
      }
    }
    
    if (!unitExists) {
      return createResponse('error', 'Invalid Unit Code. Unit does not exist in Unit Master.');
    }
    
    // Find and update stock
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString() === code.toString()) {
        sheet.getRange(i + 1, 1, 1, 3).setValues([[code, description, unitCode]]);
        return createResponse('success', 'Stock updated successfully');
      }
    }
    
    return createResponse('error', 'Stock not found');
  } catch (error) {
    return createResponse('error', 'Error updating stock: ' + error.message);
  }
}

/**
 * Delete stock from StockMaster sheet
 */
function deleteStock(code) {
  try {
    if (!code) {
      return createResponse('error', 'Stock code is required');
    }
    
    const sheet = getSheet('StockMaster');
    const data = sheet.getDataRange().getValues();
    
    // Find and delete stock
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString() === code.toString()) {
        sheet.deleteRow(i + 1);
        return createResponse('success', 'Stock deleted successfully');
      }
    }
    
    return createResponse('error', 'Stock not found');
  } catch (error) {
    return createResponse('error', 'Error deleting stock: ' + error.message);
  }
}
```

### Update doGet Function

Add the following cases to your `doGet` function to handle Stock Master API calls:

```javascript
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  const callback = params.callback;
  
  let result;
  
  // ... existing code ...
  
  // Stock Master Management
  else if (action === 'getStocks') {
    if (!validateSession(params.sessionId, params.userId)) {
      result = createResponse('error', 'Invalid session');
    } else {
      result = getStocks();
    }
  }
  else if (action === 'createStock') {
    if (!validateSession(params.sessionId, params.userId)) {
      result = createResponse('error', 'Invalid session');
    } else {
      result = createStock(params.code, params.description, params.unitCode);
    }
  }
  else if (action === 'updateStock') {
    if (!validateSession(params.sessionId, params.userId)) {
      result = createResponse('error', 'Invalid session');
    } else {
      result = updateStock(params.code, params.description, params.unitCode);
    }
  }
  else if (action === 'deleteStock') {
    if (!validateSession(params.sessionId, params.userId)) {
      result = createResponse('error', 'Invalid session');
    } else {
      result = deleteStock(params.code);
    }
  }
  
  // ... rest of existing code ...
  
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
```

## Deployment Steps

### 1. Update Apps Script
1. Open your Google Apps Script project
2. Add the Stock Master CRUD functions code above
3. Update the `doGet` function with the new action handlers
4. Save the script (Ctrl+S or Cmd+S)

### 2. Deploy New Version
1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** icon (pencil) on your active deployment
3. Under "Version", select **New version**
4. Add description: "Added Stock Master functionality"
5. Click **Deploy**
6. Copy the new Web App URL (should be the same as before)

### 3. Test the Deployment
1. Open `stockmaster.htm` in your browser
2. Log in with valid credentials
3. Test the following operations:
   - **View Stocks**: Should load existing stocks from StockMaster sheet
   - **Add Stock**: Create a new stock item with valid unit code
   - **Edit Stock**: Modify an existing stock item
   - **Delete Stock**: Remove a stock item
   - **Search**: Filter stocks by code or description

### 4. Add to Menu System
To make Stock Master accessible from the navigation menu:

1. Go to Menu Master (menumaster.htm)
2. Add a new menu item:
   - **Menu Name**: Stock Master
   - **Menu Type**: Page
   - **Parent Menu**: Masters (or appropriate parent)
   - **Page URL**: stockmaster.htm
   - **Sort Order**: (appropriate order)

3. Go to Menu Access (menuaccess.htm)
4. Assign Stock Master access to appropriate roles

## Validation Rules

### Business Rules Implemented:
1. **Code**: Required, must be unique
2. **Description**: Required
3. **UnitCode**: Required, must exist in UnitMaster sheet
4. **Duplicate Prevention**: Cannot create stock with existing code
5. **Foreign Key Validation**: UnitCode must reference valid unit

## Testing Checklist

- [ ] StockMaster sheet created with correct columns
- [ ] Apps Script code added and saved
- [ ] New version deployed successfully
- [ ] Can view all stocks
- [ ] Can create new stock with valid unit code
- [ ] Cannot create stock with invalid unit code
- [ ] Cannot create duplicate stock code
- [ ] Can edit existing stock
- [ ] Can delete stock
- [ ] Search functionality works
- [ ] Unit dropdown populates from Unit Master
- [ ] Menu access configured
- [ ] Role permissions set correctly

## Troubleshooting

### Common Issues:

**1. "Invalid Unit Code" error when creating stock**
- Verify the unit exists in UnitMaster sheet
- Check that UnitCode matches exactly (case-sensitive)

**2. Stocks not loading**
- Check StockMaster sheet exists and has correct name
- Verify column headers are exactly: Code, Description, UnitCode
- Check Apps Script execution logs for errors

**3. Unit dropdown is empty**
- Verify Unit Master is deployed and working
- Check that apiGetUnits() is functioning
- Ensure units exist in UnitMaster sheet

**4. Session errors**
- Clear browser cache and cookies
- Log out and log back in
- Check session validation in Apps Script

## File Structure

### Frontend Files:
- `stockmaster.htm` - Stock Master UI and logic

### Backend Integration:
- Google Apps Script - Stock Master CRUD functions
- StockMaster sheet - Data storage

### Dependencies:
- `api.js` - API functions (apiGetStocks, apiCreateStock, apiUpdateStock, apiDeleteStock)
- `session.js` - Session management
- `menu.js` - Menu rendering
- `systemConfig.js` - System configuration
- `menu.css` - Styling

## Security Features

- Session validation required for all operations
- XSS prevention with HTML escaping
- Input validation and sanitization
- Foreign key validation (UnitCode)
- Duplicate prevention

## Next Steps

After successful deployment:
1. Add sample stock data for testing
2. Configure menu access for appropriate roles
3. Train users on Stock Master functionality
4. Consider adding additional fields if needed (e.g., Category, Price, etc.)

## Support

For issues or questions:
1. Check Apps Script execution logs
2. Verify sheet structure and data
3. Review browser console for JavaScript errors
4. Ensure all dependencies are properly loaded
