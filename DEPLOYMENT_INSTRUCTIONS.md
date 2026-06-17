# 🚀 Deployment Instructions - Login System with Session Management

## ✅ Files Created/Updated

1. **session.js** (NEW) - Session management utility
2. **index.html** (UPDATED) - Login page with validation and session creation
3. **home.html** (NEW) - Protected dashboard page
4. **AppScript.txt** (UPDATED) - Backend API with POST method

---

## 📋 Step-by-Step Deployment

### **STEP 1: Deploy Google Apps Script Backend**

1. Open your Google Apps Script project at: https://script.google.com
2. Open the script connected to your Google Sheet
3. **Delete all existing code** in the script editor
4. **Copy the entire content from `AppScript.txt`** and paste it into the script editor
5. Click **"Deploy"** → **"New deployment"**
6. Choose type: **"Web app"**
7. Configure:
   - Description: "Login API v2"
   - Execute as: **"Me"**
   - Who has access: **"Anyone"**
8. Click **"Deploy"**
9. **Copy the new Web App URL** (it will look like: `https://script.google.com/macros/s/...../exec`)
10. Click **"Authorize access"** and grant permissions

---

### **STEP 2: Update Frontend with New API URL**

1. Open `index.html` in your editor
2. Find line 83: `const API_URL = "https://script.google.com/macros/s/..."`
3. **Replace the URL** with your new deployment URL from Step 1
4. Save the file

---

### **STEP 3: Test the System**

1. Open `index.html` in your web browser
2. Enter valid credentials from your Google Sheet:
   - Column A = User ID
   - Column C = Password
3. Click **"Login"**
4. You should be redirected to `home.html` with session info displayed
5. Test the logout button
6. Try accessing `home.html` directly without logging in (should redirect to login)

---

## 🔐 How It Works

### **Login Flow:**
1. User enters credentials → Frontend validates (not empty)
2. POST request sent to Apps Script API
3. Apps Script checks Google Sheet (Column A & C)
4. If match → Returns `{status: "success", userId: "..."}`
5. Frontend creates session in localStorage with:
   - userId
   - token (randomly generated)
   - loginTime
   - expiryTime (30 minutes from login)
6. Redirects to home.html

### **Session Protection:**
- `home.html` checks session on load
- If no session or expired → Redirect to login
- Session auto-expires after 30 minutes
- Logout clears session and redirects

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

### Change Sheet Name:
Edit `AppScript.txt` line 18:
```javascript
var sheet = ss.getSheetByName("LogIn"); // Change "LogIn" to your sheet name
```

---

## 🛠️ Troubleshooting

### Issue: "Connection error" on login
- **Solution:** Make sure you deployed the Apps Script as "Web app" with "Anyone" access
- Check that the API_URL in index.html matches your deployment URL

### Issue: "Invalid credentials" but credentials are correct
- **Solution:** Verify your Google Sheet structure:
  - Column A = User ID
  - Column C = Password (not Column B!)
  - Row 1 should be headers (data starts from row 2)

### Issue: Session not persisting
- **Solution:** Check browser localStorage is enabled
- Open browser console (F12) and check for errors

### Issue: CORS errors
- **Solution:** Apps Script deployment must be set to "Anyone" access
- Redeploy the script if needed

---

## 📁 File Structure

```
d:\Project\
├── index.html          (Login page)
├── home.html           (Protected dashboard)
├── session.js          (Session management)
├── AppScript.txt       (Backend code - paste into Google Apps Script)
└── DEPLOYMENT_INSTRUCTIONS.md (This file)
```

---

## 🎯 Next Steps

- Test all functionality thoroughly
- Add more protected pages (just include `session.js` and call `protectPage()`)
- Customize styling as needed
- Add password reset functionality (future enhancement)
- Add "Remember Me" feature (future enhancement)

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for JavaScript errors
2. Check Apps Script logs (View → Logs in script editor)
3. Verify Google Sheet structure matches requirements
