$content = Get-Content 'd:\Project\AppScript.txt' -Raw

# Step 1: Fix the truncated handleLoginGet function
$startMarker = 'function handleLoginGet(e) {'
$endMarker = "// ============================================`r`n// SESSION VALIDATION HANDLER"

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

Write-Host "handleLoginGet start: $startIdx"
Write-Host "SESSION VALIDATION start: $endIdx"

if ($startIdx -ge 0 -and $endIdx -ge 0) {
    # The complete handleLoginGet function
    $completeFunction = @"
function handleLoginGet(e) {
  var loginid = e.parameter.loginid;
  var password = e.parameter.password;
  var callback = e.parameter.callback;
  var ipAddress = getClientIP(e);
  
  if (!loginid || !password) {
    var errorResult = { status: "error", message: "Missing credentials" };
    logLoginAttempt(ipAddress, loginid, false, "Missing credentials");
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(errorResult) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return createJsonResponse(errorResult);
  }
  
  var ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Check rate limiting
  var rateLimitResult = checkRateLimit(ss, ipAddress, loginid);
  if (!rateLimitResult.allowed) {
    logLoginAttempt(ipAddress, loginid, false, rateLimitResult.message);
    var result = { status: "error", message: rateLimitResult.message };
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return createJsonResponse(result);
  }
  
  var loginSheet = ss.getSheetByName("LogIn");
  var loginData = loginSheet.getDataRange().getValues();
  var result = { status: "error", message: "Invalid credentials" };
  
  for (var i = 1; i < loginData.length; i++) {
    if (loginData[i][0] == loginid && loginData[i][2] == password) {
      var roleId = loginData[i][3];
      var userName = loginData[i][1];
      
      var rolesSheet = ss.getSheetByName("Roles");
      var rolesData = rolesSheet.getDataRange().getValues();
      var roleName = "";
      
      for (var j = 1; j < rolesData.length; j++) {
        if (rolesData[j][0] == roleId) {
          roleName = rolesData[j][1];
          break;
        }
      }
      
      var menuAccess = getRoleMenuAccess(ss, roleId);
      var sessionId = generateSessionId();
      var now = new Date().getTime();
      var expiryTime = now + SESSION_DURATION;
      
      var sessionsSheet = ss.getSheetByName("ActiveSessions");
      sessionsSheet.appendRow([
        sessionId,
        loginid,
        userName,
        roleId,
        new Date(now),
        new Date(expiryTime),
        ipAddress,
        new Date(now)
      ]);
      
      logLoginAttempt(ipAddress, loginid, true, "Login successful");
      
      result = { 
        status: "success", 
        sessionId: sessionId,
        userId: loginid,
        userName: userName,
        roleId: roleId,
        roleName: roleName,
        menuAccess: menuAccess,
        expiryTime: expiryTime
      };
      break;
    }
  }
  
  if (result.status === "error") {
    logLoginAttempt(ipAddress, loginid, false, "Invalid credentials");
  }
  
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return createJsonResponse(result);
}
"@
    
    # Replace the truncated section with the complete function
    $newContent = $content.Substring(0, $startIdx) + $completeFunction + "`r`n" + $content.Substring($endIdx)
    
    # Step 2: Add the handleGetSalesmanSalesSummaryGet function at the end
    $newFunction = @"

// ============================================
// SALESMAN SALES SUMMARY HANDLER (DASHBOARD)
// ============================================

// Get sales summary grouped by salesman for the current month
function handleGetSalesmanSalesSummaryGet(e) {
  var sessionId = e.parameter.sessionId;
  var userId = e.parameter.userId;
  var callback = e.parameter.callback;
  var ipAddress = getClientIP(e);
  
  // Validate session
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var validation = validateSession(ss, sessionId, userId, ipAddress);
  
  if (!validation.valid) {
    var errorResult = { status: "error", message: "Invalid or expired session" };
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(errorResult) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return createJsonResponse(errorResult);
  }
  
  // Calculate current month date range
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth(); // 0-based
  var firstDay = new Date(year, month, 1);
  var lastDay = new Date(year, month + 1, 0); // Last day of current month
  
  var fromDate = Utilities.formatDate(firstDay, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var toDate = Utilities.formatDate(lastDay, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  
  // Build salesman lookup map (code -> description)
  var salesmanSheet = ss.getSheetByName("Salesman");
  var salesmanData = salesmanSheet.getDataRange().getValues();
  var salesmanMap = {};
  for (var s = 1; s < salesmanData.length; s++) {
    if (salesmanData[s][0]) {
      salesmanMap[String(salesmanData[s][0]).toLowerCase()] = salesmanData[s][1] || '';
    }
  }
  
  // Get all sales from SalesHeader sheet
  var salesHeaderSheet = ss.getSheetByName("SalesHeader");
  var salesHeaderData = salesHeaderSheet.getDataRange().getValues();
  
  // Aggregate sales by salesman
  var salesBySalesman = {};
  
  for (var i = 1; i < salesHeaderData.length; i++) {
    if (salesHeaderData[i][1]) { // Check if DocNo exists
      var dateObj = salesHeaderData[i][2] ? new Date(salesHeaderData[i][2]) : null;
      var dateStr = dateObj ? Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '';
      
      // Filter by current month
      if (dateStr < fromDate || dateStr > toDate) continue;
      
      var salesmanCode = String(salesHeaderData[i][18] || '').toLowerCase();
      if (!salesmanCode) continue;
      
      var grossAmount = parseFloat(salesHeaderData[i][5]) || 0;
      var netAmount = parseFloat(salesHeaderData[i][9]) || 0;
      
      if (!salesBySalesman[salesmanCode]) {
        salesBySalesman[salesmanCode] = {
          salesmanCode: salesmanCode,
          salesmanName: salesmanMap[salesmanCode] || salesmanCode,
          totalGross: 0,
          totalNet: 0,
          invoiceCount: 0
        };
      }
      
      salesBySalesman[salesmanCode].totalGross += grossAmount;
      salesBySalesman[salesmanCode].totalNet += netAmount;
      salesBySalesman[salesmanCode].invoiceCount++;
    }
  }
  
  // Convert to array and sort by totalGross descending
  var summary = [];
  for (var key in salesBySalesman) {
    if (salesBySalesman.hasOwnProperty(key)) {
      var item = salesBySalesman[key];
      item.totalGross = Math.round(item.totalGross * 100) / 100;
      item.totalNet = Math.round(item.totalNet * 100) / 100;
      summary.push(item);
    }
  }
  
  summary.sort(function(a, b) {
    return b.totalGross - a.totalGross;
  });
  
  var result = { 
    status: "success", 
    summary: summary,
    month: month + 1,
    year: year,
    fromDate: fromDate,
    toDate: toDate
  };
  
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return createJsonResponse(result);
}
"@
    
    $newContent = $newContent + $newFunction
    
    Set-Content 'd:\Project\AppScript.txt' $newContent -NoNewline
    Write-Host 'Fixed handleLoginGet and added handleGetSalesmanSalesSummaryGet successfully'
} else {
    Write-Host 'Could not find markers'
}
