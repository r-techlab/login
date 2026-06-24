# System Parameters - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the System Parameters management page with full CRUD operations.

## Table Structure

### Google Sheet: "SystemParameters"
Create a new sheet named **SystemParameters** with the following structure:

| Column | Field Name | Data Type | Description |
|--------|-----------|-----------|-------------|
| A | Code | Text | Unique identifier (e.g., "Company Name", "Currency") |
| B | Value | Text | Current value of the parameter |
| C | Description | Text | Brief description of the parameter's purpose |

### Sample Data
```
Code              | Value        | Description
------------------|--------------|----------------------------------
Company Name      | R-TechLab    | Company Name
Currency          | AED          | Transaction Currency
```

**Header Row:** Row 1 should contain: `Code`, `Value`, `Description`

---

## Deployment Steps

### Step 1: Create Google Sheet Tab
1. Open your Google Sheet (ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`)
2. Create a new sheet/tab named exactly: **SystemParameters**
3. Add headers in Row 1: `Code`, `Value`, `Description`
4. Add sample data (optional):
   - Row 2: `Company Name`, `R-TechLab`, `Company Name`
   - Row 3: `Currency`, `AED`, `Transaction Currency`

### Step 2: Update Google Apps Script
1. Open Google Apps Script Editor (Extensions > Apps Script)
2. Open the existing `Code.gs` file
3. **Replace the entire content** with the updated code from `AppScript.txt`
4. The new code includes 4 new handler functions:
   - `handleGetSystemParametersGet(e)`
   - `handleCreateSystemParameterGet(e)`
   - `handleUpdateSystemParameterGet(e)`
   - `handleDeleteSystemParameterGet(e)`
5. Save the script (Ctrl+S or File > Save)
6. Deploy:
   - Click **Deploy** > **Manage deployments**
   - Click the **Edit** icon (pencil) on your existing deployment
   - Under "Version", select **New version**
   - Add description: "Added System Parameters CRUD operations"
   - Click **Deploy**
7. Copy the new Web App URL (it should be the same as before)

### Step 3: Update Frontend Files
1. **Upload `systemparameters.htm`** to your web server/hosting
2. **Update `api.js`** with the new API functions (already included in the file)
3. Ensure all files are in the same directory:
   - `systemparameters.htm`
   - `api.js`
   - `session.js`
   - `menu.js`
   - `menu.css`

### Step 4: Add Menu Entry (Optional)
To make the page accessible from the navigation menu:

1. Go to **Menu Master** page
2. Add a new menu item:
   - **Menu Name:** System Parameters
   - **Menu Type:** Page (P)
   - **Parent Menu:** Select appropriate parent (e.g., "Settings" or "Administration")
   - **Page URL:** `systemparameters.htm`
   - **Sort Order:** Choose appropriate order

3. Go to **Menu Access** page
4. Grant access to Admin role:
   - Select **Admin** role
   - Check the **System Parameters** menu item
   - Save changes

---

## Features

### ✅ CRUD Operations
- **Create:** Add new system parameters with unique codes
- **Read:** View all parameters in a searchable table
- **Update:** Edit parameter values and descriptions (code is locked during edit)
- **Delete:** Remove parameters with confirmation

### 🔒 Security
- **Admin-only access:** Only users with Admin role can access this page
- **Session validation:** All API calls require valid session
- **Duplicate prevention:** Cannot create parameters with existing codes
- **XSS protection:** All user inputs are escaped

### 🎨 User Interface
- **Responsive design:** Works on desktop and mobile devices
- **Search functionality:** Filter parameters by code or description
- **Statistics card:** Shows total parameter count
- **Modal forms:** Clean add/edit interface
- **Success/error messages:** Clear feedback for all operations

---

## API Endpoints

### Get All Parameters
```
GET: ?action=getSystemParameters&sessionId={sessionId}&userId={userId}
Response: { status: "success", parameters: [{code, value, description}, ...] }
```

### Create Parameter
```
GET: ?action=createSystemParameter&sessionId={sessionId}&userId={userId}&code={code}&value={value}&description={description}
Response: { status: "success", message: "Parameter created successfully" }
```

### Update Parameter
```
GET: ?action=updateSystemParameter&sessionId={sessionId}&userId={userId}&code={code}&value={value}&description={description}
Response: { status: "success", message: "Parameter updated successfully" }
```

### Delete Parameter
```
GET: ?action=deleteSystemParameter&sessionId={sessionId}&userId={userId}&code={code}
Response: { status: "success", message: "Parameter deleted successfully" }
```

---

## Testing Checklist

### ✅ Pre-Deployment
- [ ] Google Sheet "SystemParameters" tab created with correct headers
- [ ] Apps Script updated and deployed with new version
- [ ] Frontend files uploaded to web server
- [ ] Menu entry added (if applicable)
- [ ] Admin role has access to the menu item

### ✅ Post-Deployment Testing
1. **Access Control:**
   - [ ] Admin user can access the page
   - [ ] Non-admin user is denied access
   - [ ] Logged-out user is redirected to login

2. **Create Operation:**
   - [ ] Can create new parameter with all fields
   - [ ] Cannot create parameter with duplicate code
   - [ ] Validation works for required fields
   - [ ] Success message appears after creation

3. **Read Operation:**
   - [ ] All parameters display in table
   - [ ] Search functionality works
   - [ ] Statistics card shows correct count

4. **Update Operation:**
   - [ ] Can edit existing parameter
   - [ ] Code field is disabled during edit
   - [ ] Changes are saved correctly
   - [ ] Success message appears after update

5. **Delete Operation:**
   - [ ] Confirmation dialog appears
   - [ ] Parameter is deleted successfully
   - [ ] Success message appears after deletion

---

## Troubleshooting

### Issue: "Invalid or expired session"
**Solution:** Clear browser cache and login again

### Issue: "Access denied: Admin role required"
**Solution:** Ensure your user account has Admin role assigned

### Issue: "Parameter code already exists"
**Solution:** Use a unique code for each parameter

### Issue: Page not loading
**Solution:** 
1. Check that all files are uploaded correctly
2. Verify API_URL in `api.js` matches your Apps Script deployment URL
3. Check browser console for JavaScript errors

### Issue: "Connection error"
**Solution:**
1. Verify Apps Script is deployed as Web App
2. Check that deployment is set to "Anyone" access
3. Ensure Google Sheet ID is correct in Apps Script

---

## File Structure
```
d:/Project/
├── systemparameters.htm          # Frontend page (NEW)
├── api.js                         # API functions (UPDATED)
├── AppScript.txt                  # Backend code (UPDATED)
├── session.js                     # Session management
├── menu.js                        # Menu rendering
├── menu.css                       # Shared styles
└── SYSTEM_PARAMETERS_DEPLOYMENT.md # This file
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify Google Apps Script logs (View > Logs)
4. Ensure all deployment steps were followed correctly

---

## Version History

**Version 1.0** (June 24, 2026)
- Initial release
- Full CRUD operations for System Parameters
- Admin-only access control
- Search and filter functionality
- Responsive design

---

## Notes

- The **Code** field is the primary key and must be unique
- Code field is disabled during edit to prevent key changes
- All operations require Admin role
- Session validation is enforced on all API calls
- Parameters are stored in Google Sheets for easy management

---

**Deployment Complete! 🎉**

Your System Parameters management page is now ready to use. Access it at:
`https://your-domain.com/systemparameters.htm`
