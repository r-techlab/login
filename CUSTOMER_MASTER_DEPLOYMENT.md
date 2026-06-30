# Customer Master Deployment Guide

## Overview
This guide provides instructions for deploying the Customer Master functionality to your Google Apps Script backend.

## Files Created
1. **api.js** - Added Customer Master API functions
2. **customermaster.htm** - Customer Master frontend interface

## Google Apps Script Backend Setup

### Step 1: Create CustomerMaster Sheet

Create a new sheet in your Google Spreadsheet named **"CustomerMaster"** with the following columns:

| Column | Description |
|--------|-------------|
| Code | Customer code (unique identifier, format: CUST001) |
| Description | Customer name/description |
| TRN | Tax Registration Number |
| Tel1 | Primary telephone |
| Tel2 | Secondary telephone |
| Mobile | Mobile number |
| Email1 | Primary email |
| Email2 | Secondary email |
| HomePage | Website URL |
| AddressStreet | Street address |
| AddressCity | City |
| AddressEmirate | Emirates (dropdown: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah) |
| AddressPO | PO Box |
| AddressCountry | Country |

### Step 2: Add Backend Functions

Add the following functions to your Google Apps Script Code.gs file:

```javascript
// ============================================
// CUSTOMER MASTER MANAGEMENT
// ============================================

/**
 * Get all customers from CustomerMaster sheet
 */
function getCustomers() {
  try {
    const sheet = getSheet('CustomerMaster');
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse('success', 'No customers found', { customers: [] });
    }
    
    const headers = data[0];
    const customers = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { // Check if Code exists
        customers.push({
          code: row[0],
          description: row[1] || '',
          trn: row[2] || '',
          tel1: row[3] || '',
          tel2: row[4] || '',
          mobile: row[5] || '',
          email1: row[6] || '',
          email2: row[7] || '',
          homePage: row[8] || '',
          addressStreet: row[9] || '',
          addressCity: row[10] || '',
          addressEmirate: row[11] || '',
          addressPO: row[12] || '',
          addressCountry: row[13] || ''
        });
      }
    }
    
    return createResponse('success', 'Customers retrieved successfully', { customers: customers });
  } catch (error) {
    return createResponse('error', 'Error retrieving customers: ' + error.message);
  }
}

/**
 * Create a new customer
 */
function createCustomer(code, description, trn, tel1, tel2, mobile, email1, email2, homePage, addressStreet, addressCity, addressEmirate, addressPO, addressCountry) {
  try {
    const sheet = getSheet('CustomerMaster');
    
    // Check for duplicate code
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toUpperCase() === code.toString().toUpperCase()) {
        return createResponse('error', 'Customer code already exists');
      }
    }
    
    // Validate required fields
    if (!code || !description) {
      return createResponse('error', 'Code and Description are required');
    }
    
    // Validate code format (CUST + numbers)
    const codePattern = /^CUST\d+$/i;
    if (!codePattern.test(code)) {
      return createResponse('error', 'Customer code must follow format: CUST + numbers (e.g., CUST001)');
    }
    
    // Add new customer
    sheet.appendRow([
      code.toUpperCase(),
      description,
      trn || '',
      tel1 || '',
      tel2 || '',
      mobile || '',
      email1 || '',
      email2 || '',
      homePage || '',
      addressStreet || '',
      addressCity || '',
      addressEmirate || '',
      addressPO || '',
      addressCountry || ''
    ]);
    
    return createResponse('success', 'Customer created successfully');
  } catch (error) {
    return createResponse('error', 'Error creating customer: ' + error.message);
  }
}

/**
 * Update an existing customer
 */
function updateCustomer(code, description, trn, tel1, tel2, mobile, email1, email2, homePage, addressStreet, addressCity, addressEmirate, addressPO, addressCountry) {
  try {
    const sheet = getSheet('CustomerMaster');
    const data = sheet.getDataRange().getValues();
    
    // Validate required fields
    if (!code || !description) {
      return createResponse('error', 'Code and Description are required');
    }
    
    // Find and update customer
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toUpperCase() === code.toString().toUpperCase()) {
        sheet.getRange(i + 1, 1, 1, 14).setValues([[
          code.toUpperCase(),
          description,
          trn || '',
          tel1 || '',
          tel2 || '',
          mobile || '',
          email1 || '',
          email2 || '',
          homePage || '',
          addressStreet || '',
          addressCity || '',
          addressEmirate || '',
          addressPO || '',
          addressCountry || ''
        ]]);
        return createResponse('success', 'Customer updated successfully');
      }
    }
    
    return createResponse('error', 'Customer not found');
  } catch (error) {
    return createResponse('error', 'Error updating customer: ' + error.message);
  }
}

/**
 * Delete a customer
 */
function deleteCustomer(code) {
  try {
    const sheet = getSheet('CustomerMaster');
    const data = sheet.getDataRange().getValues();
    
    // Find and delete customer
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toUpperCase() === code.toString().toUpperCase()) {
        sheet.deleteRow(i + 1);
        return createResponse('success', 'Customer deleted successfully');
      }
    }
    
    return createResponse('error', 'Customer not found');
  } catch (error) {
    return createResponse('error', 'Error deleting customer: ' + error.message);
  }
}
```

### Step 3: Update doGet Function

Add the following cases to your `doGet(e)` function in Code.gs:

```javascript
// Add these cases to your existing doGet function switch statement

case 'getCustomers':
  if (!isValidSession) {
    return jsonp(callback, createResponse('error', 'Invalid session'));
  }
  result = getCustomers();
  break;

case 'createCustomer':
  if (!isValidSession) {
    return jsonp(callback, createResponse('error', 'Invalid session'));
  }
  result = createCustomer(
    e.parameter.code,
    e.parameter.description,
    e.parameter.trn,
    e.parameter.tel1,
    e.parameter.tel2,
    e.parameter.mobile,
    e.parameter.email1,
    e.parameter.email2,
    e.parameter.homePage,
    e.parameter.addressStreet,
    e.parameter.addressCity,
    e.parameter.addressEmirate,
    e.parameter.addressPO,
    e.parameter.addressCountry
  );
  break;

case 'updateCustomer':
  if (!isValidSession) {
    return jsonp(callback, createResponse('error', 'Invalid session'));
  }
  result = updateCustomer(
    e.parameter.code,
    e.parameter.description,
    e.parameter.trn,
    e.parameter.tel1,
    e.parameter.tel2,
    e.parameter.mobile,
    e.parameter.email1,
    e.parameter.email2,
    e.parameter.homePage,
    e.parameter.addressStreet,
    e.parameter.addressCity,
    e.parameter.addressEmirate,
    e.parameter.addressPO,
    e.parameter.addressCountry
  );
  break;

case 'deleteCustomer':
  if (!isValidSession) {
    return jsonp(callback, createResponse('error', 'Invalid session'));
  }
  result = deleteCustomer(e.parameter.code);
  break;
```

### Step 4: Add Menu Entry (Optional)

To add Customer Master to your menu system, add an entry to the MenuMaster sheet:

| MenuId | MenuName | MenuType | ParentMenuId | PageUrl | SortOrder |
|--------|----------|----------|--------------|---------|-----------|
| (auto) | Customer Master | Page | (parent menu id) | customermaster.htm | (order) |

Then assign access to appropriate roles in the Menu Access management.

## Features

### Customer Master Form Includes:

1. **Basic Information Section**
   - Code (Required, format: CUST001)
   - Description (Required)
   - TRN (Tax Registration Number)

2. **Contact Information Section**
   - Telephone 1
   - Telephone 2
   - Mobile
   - Email 1 (with validation)
   - Email 2 (with validation)
   - Website (with URL validation)

3. **Address Information Section**
   - Street Address
   - City
   - Emirate (Dropdown with all 7 UAE emirates)
   - PO Box
   - Country (Free text)

### Validation Rules:
- Code format: CUST + numbers (e.g., CUST001)
- Code must be unique
- Email format validation
- URL format validation for website
- Only Code and Description are required fields

### Table Display Columns:
- Code
- Description
- TRN
- Tel1
- Mobile
- Email1
- Actions (Edit/Delete)

## Testing

1. Open `customermaster.htm` in your browser
2. Test adding a new customer with code "CUST001"
3. Verify all fields are saved correctly
4. Test editing the customer
5. Test search functionality
6. Test delete functionality

## Security

- Session validation required for all operations
- Menu-based access control
- XSS protection with HTML escaping
- Duplicate code prevention

## Troubleshooting

**Issue**: "Invalid session" error
- **Solution**: Ensure you're logged in and session is valid

**Issue**: "Customer code already exists"
- **Solution**: Use a unique customer code

**Issue**: "Customer code must follow format"
- **Solution**: Use format CUST001, CUST002, etc.

**Issue**: Data not loading
- **Solution**: Check that CustomerMaster sheet exists with correct column headers

## Support

For issues or questions, refer to the main deployment documentation or contact your system administrator.
