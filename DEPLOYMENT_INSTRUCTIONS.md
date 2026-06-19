# 🚀 Deployment Instructions - Role-Based Menu System with Session Management

## ✅ Files Created/Updated

### Core System Files:
1. **session.js** (UPDATED) - Session management with role and menu data
2. **menu.js** (NEW) - Menu rendering and navigation component
3. **menu.css** (NEW) - Menu styling and layout
4. **index.html** (UPDATED) - Login page with role-based authentication
5. **home.html** (UPDATED) - Dashboard with dynamic menu display
6. **AppScript.txt** (UPDATED) - Backend API with role and menu access

### Sample Pages:
7. **customer.htm** (NEW) - Customer management page
8. **supplier.htm** (NEW) - Supplier management page
9. **salesreport.htm** (NEW) - Sales report page

---

## 📊 Google Sheets Database Structure

Your Google Sheet should have these tabs with the following structure:

### **LogIn Tab:**
| LoginId | UserName | Password | Role |
|---------|----------|----------|------|
| riyas | Muhammed Riyas | 123 | 1 |

### **Roles Tab:**
| RolesId | RolesName |
|---------|-----------|
| 1 | Admin |

### **MenuMaster Tab:**
| MenuId | ParentMenuId | MenuType | MenuName | PageUrl | SortOrder |
|--------|--------------|----------|----------|---------|-----------|
| 1 | NULL | G | Masters | NULL | 1 |
| 2 | 1 | P | Customer | customer.htm | 1 |
| 3 | 1 | P | Supplier | supplier.htm | 2 |
| 4 | NULL | P | Dashboard | home.html | 2 |
| 5 | NULL | G | Reports | NULL | 3 |
| 6 | 5 | P | Sales Report | salesreport.htm | 1 |

**MenuType Values:**
- **G** = Group (parent menu with children)
- **P** = Page (direct link to a page)

### **RoleMenuAccess Tab:**
| RoleId | MenuId |
|--------|--------|
| 1 | 1 |
| 1 | 2 |
| 1 | 3 |
| 1 | 4 |
| 1 | 5 |
| 1 | 6 |

---

## 📋 Step-by-Step Deployment

### **STEP 1: Set Up Google Sheets Database**

1. Open your Google Sheet (ID: `1mZlKmBLoLXwYNeIBcqDvE1NZgd1KQ3rXYDh_UfxLApI`)
2. Create the following tabs if they don't exist:
   - **LogIn**
   - **Roles**
   - **MenuMaster**
   - **RoleMenuAccess**
3. Add the data structure as shown above
4. Make sure column headers are in Row 1, data starts from Row 2

---

### **STEP 2: Deploy Google Apps Script Backend**

1. Open your Google Apps Script project at: https://script.google.com
2. Open the script connected to your Google Sheet
3. **Delete all existing code** in the script editor
4. **Copy the entire content from `AppScript.txt`** and paste it into the script editor
5. Click **"Deploy"** → **"New deployment"**
6. Choose type: **"Web app"**
7. Configure:
   - Description: "Role-Based Menu API v3"
   - Execute as: **"Me"**
   - Who has access: **"Anyone"**
8. Click **"Deploy"**
9. **Copy the new Web App URL** (it will look like: `https://script.google.com/macros/s/...../exec`)
10. Click **"Authorize access"** and grant permissions

---

### **STEP 3: Update Frontend with New API URL**

1. Open `index.html` in your editor
2. Find line 87: `const API_URL = "https://script.google.com/macros/s/..."`
3. **Replace the URL** with your new deployment URL from Step 2
4. Save the file

---

### **STEP 4: Test the System**

1. Open `index.html` in your web browser
2. Enter credentials:
   - **Login ID:** riyas
   - **Password:** 123
3. Click **"Login"**
4. You should be redirected to `home.html` with:
   - Dynamic menu showing all accessible items
   - Dashboard cards showing menu statistics
   - Session information
5. Test navigation:
   - Click on "Masters" to expand the submenu
   - Click on "Customer" to navigate to customer.htm
   - Click on "Supplier" to navigate to supplier.htm
   - Click on "Sales Report" under Reports
6. Test logout functionality
7. Try accessing protected pages directly without logging in (should redirect to login)

---

## 🔐 How the Role-Based Menu System Works

### **Login Flow:**
1. User enters credentials → Frontend validates (not empty)
2. JSONP request sent to Apps Script API
3. Apps Script checks Google Sheet (LogIn tab)
4. If match found:
   - Retrieves user's role from Roles tab
   - Fetches menu access from RoleMenuAccess tab
   - Builds menu structure from MenuMaster tab
   - Returns complete user data with menu access
5. Frontend creates session in localStorage with:
   - userId, userName, roleId, roleName
   - menuAccess (array of accessible menu items)
   - token, loginTime, expiryTime (30 minutes)
6. Redirects to home.html

### **Menu Rendering:**
1. `menu.js` reads menu data from session
2. Builds hierarchical structure (parent-child relationships)
3. Renders menu with:
   - Group menus (expandable/collapsible)
   - Page menus (direct links)
   - Active page highlighting
   - Breadcrumb navigation
4. Only shows menus the user has access to

### **Session Protection:**
- All pages check session on load using `protectPage()`
- If no session or expired → Redirect to login
- Session auto-expires after 30 minutes
- Logout clears session and redirects

---

## 🎨 Menu Features

### **Dynamic Menu:**
- ✅ Hierarchical structure (parent-child menus)
- ✅ Expandable/collapsible groups
- ✅ Active page highlighting
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Role-based access control

### **Breadcrumb Navigation:**
- Shows current page location
- Displays parent menu hierarchy
- Clickable links to navigate back

### **Menu Statistics:**
- Total menu items accessible
- Number of menu groups
- Number of accessible pages

---

## ⚙️ Configuration Options

### Change Session Duration:
Edit `session.js` line 5:
```javascript
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
// Change to: 60 * 60 * 1000 for 1 hour
```

### Change Google Sheet ID:
Edit `AppScript.txt` line 17:
```javascript
var ss = SpreadsheetApp.openById("YOUR_SHEET_ID_HERE");
```

### Add New Menu Items:
1. Add entry to **MenuMaster** tab in Google Sheet
2. Add entry to **RoleMenuAccess** tab for each role that should access it
3. Create the corresponding HTML page (if MenuType = 'P')
4. Redeploy the Apps Script (or it will auto-update on next login)

### Add New Roles:
1. Add entry to **Roles** tab
2. Update user's Role column in **LogIn** tab
3. Add menu access entries in **RoleMenuAccess** tab

---

## 🛠️ Troubleshooting

### Issue: Menu not showing
- **Solution:** Check browser console (F12) for errors
- Verify session contains menuAccess data
- Check that RoleMenuAccess has entries for the user's role

### Issue: "Connection error" on login
- **Solution:** Make sure Apps Script is deployed as "Web app" with "Anyone" access
- Check that the API_URL in index.html matches your deployment URL

### Issue: Menu items not clickable
- **Solution:** Verify PageUrl in MenuMaster is correct
- Check that the HTML files exist in your project folder

### Issue: Submenu not expanding
- **Solution:** Ensure menu.js is loaded properly
- Check that MenuType is 'G' for group menus
- Verify ParentMenuId is set correctly for child menus

### Issue: Session not persisting
- **Solution:** Check browser localStorage is enabled
- Open browser console (F12) and check for errors

---

## 📁 File Structure

```
d:\Project\
├── index.html              (Login page)
├── home.html               (Dashboard with dynamic menu)
├── session.js              (Session management with role data)
├── menu.js                 (Menu rendering component)
├── menu.css                (Menu styling)
├── customer.htm            (Customer management page)
├── supplier.htm            (Supplier management page)
├── salesreport.htm         (Sales report page)
├── AppScript.txt           (Backend code - paste into Google Apps Script)
└── DEPLOYMENT_INSTRUCTIONS.md (This file)
```

---

## 🎯 Next Steps & Enhancements

### Immediate:
- ✅ Test all menu navigation
- ✅ Verify role-based access control
- ✅ Test session expiration
- ✅ Test on different browsers

### Future Enhancements:
- Add more roles (Manager, User, Guest, etc.)
- Implement page-level permissions (view, edit, delete)
- Add user profile management
- Implement password reset functionality
- Add "Remember Me" feature
- Create admin panel for menu management
- Add audit logging for user actions
- Implement multi-level menu hierarchy (3+ levels)

---

## 💡 Tips for Customization

### Customize Menu Icons:
Edit `menu.js` lines 40-41 and 73-74 to change emoji icons:
```javascript
html += `<span class="menu-icon">📁</span>`; // Group icon
html += `<span class="menu-icon">📄</span>`; // Page icon
```

### Customize Menu Colors:
Edit `menu.css` to change color scheme:
```css
.main-menu {
    background: #2c3e50; /* Change this */
}
```

### Add More Sample Pages:
1. Copy any existing .htm file (e.g., customer.htm)
2. Rename and customize content
3. Add entry to MenuMaster in Google Sheet
4. Add access in RoleMenuAccess

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for JavaScript errors
2. Check Apps Script logs (View → Logs in script editor)
3. Verify Google Sheet structure matches requirements
4. Ensure all file names match exactly (case-sensitive)
5. Test with the provided sample credentials first

---

## 🎉 Success Checklist

- [ ] Google Sheets tabs created with correct structure
- [ ] Apps Script deployed successfully
- [ ] API URL updated in index.html
- [ ] Login works with sample credentials
- [ ] Menu displays correctly on home.html
- [ ] Menu groups expand/collapse properly
- [ ] Navigation to all pages works
- [ ] Breadcrumb shows correct path
- [ ] Session expires after 30 minutes
- [ ] Logout works correctly
- [ ] Protected pages redirect to login when not authenticated

---

**Congratulations! Your role-based menu system is now fully functional! 🎊**
