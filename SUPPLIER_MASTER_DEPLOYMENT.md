# Supplier Master Deployment Guide

## Overview
The Supplier Master module allows management of supplier information including contact details, TRN, and address information.

## Files Created/Modified

### New Files
1. **suppliermaster.htm** - Frontend page for Supplier Master management

### Modified Files
1. **api.js** - Added API functions for supplier CRUD operations
2. **AppScript.txt** - Added backend handlers for supplier management
3. **indexedDB.js** - Added supplier caching support

## Deployment Steps

### Step 1: Deploy Google Apps Script Backend
1. Open your Google Apps Script project
2. Copy the contents of `AppScript.txt` into your Code.gs file
3. Save and deploy the script as a new version
4. Note the new deployment URL

### Step 2: Update API Configuration
1. Open `api.js`
2. Update the `API_BASE_URL` variable with your new deployment URL if changed

### Step 3: Deploy Frontend Files
1. Upload `suppliermaster.htm` to your web server
2. Upload updated `api.js` and `indexedDB.js` to your web server

### Step 4: Google Sheets Setup
1. Open your Google Sheet
2. Create a new sheet named "SupplierMaster"
3. Add the following header row:
   - Code, Description, TRN, Tel1, Tel2, Mobile, Email1, Email2, HomePage, AddressStreet, AddressCity, AddressEmirate, AddressPO, AddressCountry

### Step 5: Menu Setup
1. Log in as Admin
2. Go to Menu Master
3. Add a new menu entry for Supplier Master:
   - Menu Name: Supplier Master
   - Menu Type: Item
   - Page URL: suppliermaster.htm
   - Sort Order: (appropriate position)
4. Assign this menu to the appropriate roles via Menu Access

## Features
- **CRUD Operations**: Create, Read, Update, Delete suppliers
- **Code Format**: Supplier codes follow format SUPP + numbers (e.g., SUPP001)
- **Contact Details**: Multiple phone numbers, emails, and website
- **Address Information**: Street, City, Emirate, PO Box, Country
- **TRN**: Tax Registration Number field
- **Offline Caching**: Supplier data is cached in IndexedDB for faster loading
- **Session Security**: All operations require valid session authentication

## API Endpoints
- `action=getSuppliers` - Get all suppliers
- `action=createSupplier` - Create new supplier
- `action=updateSupplier` - Update existing supplier
- `action=deleteSupplier` - Delete supplier

## IndexedDB Functions
- `saveSuppliersToDB(suppliers)` - Cache suppliers locally
- `getSuppliersFromDB(callback)` - Retrieve cached suppliers
- `clearSuppliersFromDB()` - Clear cached suppliers
