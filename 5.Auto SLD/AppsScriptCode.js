/**
 * Google Apps Script for Auto SLD Web App Database
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any default code and paste this script
 * 4. Save and click "Deploy" > "New Deployment"
 * 5. Select type "Web App", set Execute as "Me", and Who has access to "Anyone"
 * 6. Copy the Web App URL and paste it into the SLD Web App settings
 */

// Helper to set CORS headers
function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle CORS Preflight Options Request
function doOptions(e) {
  return responseJson({ status: "ok" });
}

// GET Request handler
function doGet(e) {
  try {
    // 1. Get active user's Google email
    let userEmail = Session.getActiveUser().getEmail();
    
    // 2. Serve HTML UI if no action parameter is specified (browser request)
    const action = e.parameter.action;
    if (!action) {
      return HtmlService.createHtmlOutputFromFile('Index')
          .setTitle('SLD STUDIO Pro - Solar Design Tool')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }

    // Serve self-closing success page for login requests
    if (action === "login") {
      const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <title>เข้าสู่ระบบสำเร็จ | SLD STUDIO Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Sarabun', sans-serif;
        background-color: #070d19;
        color: #e2e8f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      .card {
        background-color: #0f172a;
        padding: 3rem;
        border-radius: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
        border: 1px solid #1e293b;
        max-width: 450px;
        width: 90%;
      }
      .success-icon {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        color: #10b981;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        margin: 0 auto 1.5rem;
      }
      h2 {
        color: #38bdf8;
        font-size: 1.5rem;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 0.75rem;
      }
      p {
        color: #94a3b8;
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 2rem;
      }
      .btn {
        background: linear-gradient(to right, #06b6d4, #3b82f6);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        font-size: 0.95rem;
        font-weight: bold;
        border-radius: 0.75rem;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;
      }
      .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
      }
      .btn:active {
        transform: translateY(1px);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="success-icon">✓</div>
      <h2>เข้าสู่ระบบและยืนยันสิทธิ์สำเร็จ</h2>
      <p>
        โปรแกรมได้รับสิทธิ์ซิงค์ฐานข้อมูลโครงการเรียบร้อยแล้ว<br>
        <strong>คุณสามารถปิดหน้าต่างนี้เพื่อเริ่มใช้งานได้ทันที</strong>
      </p>
      <button onclick="window.close()" class="btn">ปิดหน้าต่างนี้ (Close Window)</button>
    </div>
    <script>
      // Try to close window automatically after 1.5s
      setTimeout(function() {
        window.close();
      }, 1500);
    </script>
  </body>
</html>
      `;
      return HtmlService.createHtmlOutput(htmlContent)
          .setTitle('SLD STUDIO Pro - Solar Design Tool')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Action 1: Get list of saved projects
    if (action === "getProjects") {
      const sheet = ss.getSheetByName("Projects");
      if (!sheet) {
        return responseJson([]);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return responseJson([]); // only headers
      
      const headers = data[0];
      const projects = [];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const project = {};
        headers.forEach((h, idx) => {
          project[h] = row[idx];
        });
        projects.push(project);
      }
      return responseJson(projects);
    }
    
    // Ensure 'Data base' sheet exists
    let dbSheet = ss.getSheetByName("Data base");

    // Action 3: Cleanup database sheets
    if (action === "cleanupDb") {
      const sheetsToDelete = ["Cables", "Ampacity", "CableOD", "Conduits", "Trays", "Data base"];
      let deletedCount = 0;
      sheetsToDelete.forEach(name => {
        const s = ss.getSheetByName(name);
        if (s) {
          ss.deleteSheet(s);
          deletedCount++;
        }
      });
      return responseJson({ success: true, message: "Deleted " + deletedCount + " database sheets successfully." });
    }

    // Action 2: Get standard Database Tables
    if (action === "pullDb") {
      if (!dbSheet) {
        return responseJson({ success: true, db: null, message: "Data base sheet not found, using frontend defaults." });
      }
      
      const rows = dbSheet.getDataRange().getValues();
      if (rows.length <= 2) {
        return responseJson({ success: true, db: null, message: "Data base sheet is empty, using frontend defaults." });
      }

      const db = {
        cables: {},
        ampacity: {},
        cableOD: {},
        conduitSizes: [],
        traySizes: []
      };
      
      // 1. Parse Cables (Columns A-D, indices 0..3)
      for (let i = 2; i < rows.length; i++) {
        const type = rows[i][0];
        const size = String(rows[i][1]);
        const r = String(rows[i][2]);
        const x = String(rows[i][3]);
        if (type && size && r && x) {
          if (!db.cables[type]) db.cables[type] = [];
          db.cables[type].push({ size, r, x });
        }
      }
      
      // 2. Parse Ampacity (Columns F-J, indices 5..9)
      for (let i = 2; i < rows.length; i++) {
        const type = rows[i][5];
        const install = rows[i][6];
        const cores = rows[i][7];
        const size = String(rows[i][8]);
        const amp = Number(rows[i][9]);
        if (type && install && cores && size && !isNaN(amp)) {
          if (!db.ampacity[type]) db.ampacity[type] = {};
          if (!db.ampacity[type][install]) db.ampacity[type][install] = {};
          if (!db.ampacity[type][install][cores]) db.ampacity[type][install][cores] = {};
          db.ampacity[type][install][cores][size] = amp;
        }
      }
      
      // 3. Parse CableOD (Columns L-N, indices 11..13)
      for (let i = 2; i < rows.length; i++) {
        const size = String(rows[i][11]);
        const cores = rows[i][12];
        const od = Number(rows[i][13]);
        if (size && cores && !isNaN(od)) {
          if (!db.cableOD[size]) db.cableOD[size] = {};
          db.cableOD[size][cores] = od;
        }
      }
      
      // 4. Parse Conduits (Columns P-R, indices 15..17)
      for (let i = 2; i < rows.length; i++) {
        const size = String(rows[i][15]);
        const id = Number(rows[i][16]);
        const area40 = Number(rows[i][17]);
        if (size && !isNaN(id) && !isNaN(area40)) {
          db.conduitSizes.push({ size, id, area40 });
        }
      }
      
      // 5. Parse Trays (Column T, index 19)
      for (let i = 2; i < rows.length; i++) {
        const sz = Number(rows[i][19]);
        if (!isNaN(sz) && rows[i][19] !== "") {
          db.traySizes.push(sz);
        }
      }
      
      return responseJson({ success: true, db });
    }
    
    return responseJson({ success: false, error: "Invalid action" });
  } catch (error) {
    return responseJson({ success: false, error: error.toString() });
  }
}

// POST Request handler
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    
    if (action === "saveProject") {
      let sheet = ss.getSheetByName("Projects");
      if (!sheet) {
        // Create Projects sheet if it doesn't exist
        sheet = ss.insertSheet("Projects");
        sheet.appendRow([
          "ProjectID", "ProjectName", "SystemType", "Voltage", 
          "Pf", "MaxVd", "GlobalSpecsJson", "FeedersJson", "SavedAt"
        ]);
        // Freeze header row
        sheet.setFrozenRows(1);
      }
      
      const p = postData.project;
      const projectId = p.projectId || "PROJ_" + Date.now();
      const savedAt = new Date().toISOString();
      
      // Look for existing project row to update
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === projectId) {
          rowIndex = i + 1; // 1-indexed
          break;
        }
      }
      
      const rowData = [
        projectId,
        p.projectName || "Unnamed Project",
        p.systemType || "3P 4W Full N",
        p.voltage || "400",
        p.pf || "1.0",
        p.maxVd || "2.5",
        JSON.stringify(p.globalSpecs || {}),
        JSON.stringify(p.feeders || []),
        savedAt
      ];
      
      if (rowIndex !== -1) {
        // Update existing row
        sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        // Append new row
        sheet.appendRow(rowData);
      }
      
      return responseJson({ success: true, projectId, message: "Project saved successfully" });
    }
    
    if (action === "saveDb") {
      const db = postData.db;
      if (!db) {
        return responseJson({ success: false, error: "No database data provided" });
      }
      
      // Ensure 'Data base' sheet exists
      let dbSheet = ss.getSheetByName("Data base");
      if (!dbSheet) {
        dbSheet = ss.insertSheet("Data base");
      }
      dbSheet.clear();
      
      // Setup titles and headers
      dbSheet.getRange("A1").setValue("Cables");
      dbSheet.getRange("A2:D2").setValues([["Cable Type", "Size", "R", "X"]]);
      
      dbSheet.getRange("F1").setValue("Ampacity");
      dbSheet.getRange("F2:J2").setValues([["Cable Type", "Installation", "Cores", "Size", "Ampacity"]]);
      
      dbSheet.getRange("L1").setValue("CableOD");
      dbSheet.getRange("L2:N2").setValues([["Size", "Cores", "OD"]]);
      
      dbSheet.getRange("P1").setValue("Conduits");
      dbSheet.getRange("P2:R2").setValues([["Size", "ID", "Area40"]]);
      
      dbSheet.getRange("T1").setValue("Trays");
      dbSheet.getRange("T2").setValue("Size");
      
      // Format headers as Bold
      dbSheet.getRange("A1:T2").setFontWeight("bold");
      
      // 1. Cables
      const cablesRows = [];
      if (db.cables) {
        for (const type in db.cables) {
          db.cables[type].forEach(c => {
            cablesRows.push([type, c.size, c.r, c.x]);
          });
        }
      }
      
      // 2. Ampacity
      const ampacityRows = [];
      if (db.ampacity) {
        for (const type in db.ampacity) {
          for (const install in db.ampacity[type]) {
            for (const cores in db.ampacity[type][install]) {
              for (const size in db.ampacity[type][install][cores]) {
                const amp = db.ampacity[type][install][cores][size];
                ampacityRows.push([type, install, cores, size, amp]);
              }
            }
          }
        }
      }
      
      // 3. CableOD
      const odRows = [];
      if (db.cableOD) {
        for (const size in db.cableOD) {
          for (const cores in db.cableOD[size]) {
            const od = db.cableOD[size][cores];
            odRows.push([size, cores, od]);
          }
        }
      }
      
      // 4. Conduits
      const conduitRows = [];
      if (db.conduitSizes) {
        db.conduitSizes.forEach(c => {
          conduitRows.push([c.size, c.id, c.area40]);
        });
      }
      
      // 5. Trays
      const trayRows = [];
      if (db.traySizes) {
        db.traySizes.forEach(sz => {
          trayRows.push([sz]);
        });
      }
      
      // Write data to sheet
      if (cablesRows.length > 0) {
        dbSheet.getRange(3, 1, cablesRows.length, 4).setValues(cablesRows);
      }
      if (ampacityRows.length > 0) {
        dbSheet.getRange(3, 6, ampacityRows.length, 5).setValues(ampacityRows);
      }
      if (odRows.length > 0) {
        dbSheet.getRange(3, 12, odRows.length, 3).setValues(odRows);
      }
      if (conduitRows.length > 0) {
        dbSheet.getRange(3, 16, conduitRows.length, 3).setValues(conduitRows);
      }
      if (trayRows.length > 0) {
        dbSheet.getRange(3, 20, trayRows.length, 1).setValues(trayRows);
      }
      
      // Delete old sheets
      const oldSheets = ["Cables", "Ampacity", "CableOD", "Conduits", "Trays"];
      oldSheets.forEach(name => {
        const s = ss.getSheetByName(name);
        if (s) {
          ss.deleteSheet(s);
        }
      });
      
      return responseJson({ success: true, message: "Database saved to 'Data base' sheet and old sheets deleted successfully." });
    }

    if (action === "register") {
      let sheet = ss.getSheetByName("Users");
      if (!sheet) {
        sheet = ss.insertSheet("Users");
        sheet.appendRow(["Email", "Name", "PasswordHash", "Role", "CreatedAt", "LastLogin", "Status"]);
        sheet.setFrozenRows(1);
      }
      
      const email = String(postData.email || "").trim().toLowerCase();
      const name = String(postData.name || "").trim();
      const password = String(postData.password || "");
      
      if (!email || !name || !password) {
        return responseJson({ success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
      
      // Check if email already exists
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).toLowerCase() === email) {
          return responseJson({ success: false, error: "อีเมลนี้ถูกใช้งานแล้ว" });
        }
      }
      
      const passwordHash = hashPassword(password);
      const role = "User"; // Default role when registering
      const createdAt = new Date().toISOString();
      const status = "Pending"; // New registration requires Admin approval
      
      sheet.appendRow([email, name, passwordHash, role, createdAt, "", status]);
      
      return responseJson({ success: true, message: "สมัครสมาชิกสำเร็จ! กรุณารอผู้ดูแลระบบ (Admin) อนุมัติการใช้งาน" });
    }

    if (action === "loginUser") {
      let sheet = ss.getSheetByName("Users");
      if (!sheet) {
        // If Users sheet doesn't exist, create it and register an Admin user as a fallback
        sheet = ss.insertSheet("Users");
        sheet.appendRow(["Email", "Name", "PasswordHash", "Role", "CreatedAt", "LastLogin", "Status"]);
        sheet.setFrozenRows(1);
        
        // Pre-populate admin account
        const adminEmail = "admin@admin.com";
        const adminName = "System Administrator";
        const adminHash = hashPassword("admin123");
        sheet.appendRow([adminEmail, adminName, adminHash, "Admin", new Date().toISOString(), "", "Approved"]);
      }
      
      const email = String(postData.email || "").trim().toLowerCase();
      const password = String(postData.password || "");
      
      if (!email || !password) {
        return responseJson({ success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
      
      let data = sheet.getDataRange().getValues();
      let foundUser = null;
      let userRowIndex = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).toLowerCase() === email) {
          foundUser = {
            email: data[i][0],
            name: data[i][1],
            passwordHash: data[i][2],
            role: data[i][3] || "User",
            status: data[i][6] || "Approved" // Default to Approved for older data
          };
          userRowIndex = i + 1; // 1-indexed
          break;
        }
      }
      
      if (!foundUser && email === "admin@admin.com") {
        const adminEmail = "admin@admin.com";
        const adminName = "System Administrator";
        const adminHash = hashPassword("admin123");
        sheet.appendRow([adminEmail, adminName, adminHash, "Admin", new Date().toISOString(), "", "Approved"]);
        
        foundUser = {
          email: adminEmail,
          name: adminName,
          passwordHash: adminHash,
          role: "Admin",
          status: "Approved"
        };
        userRowIndex = sheet.getLastRow();
      }
      
      if (!foundUser) {
        return responseJson({ success: false, error: "ไม่พบบัญชีผู้ใช้งานนี้" });
      }
      
      if (foundUser.status !== "Approved") {
        return responseJson({ success: false, error: "บัญชีของคุณกำลังรอการอนุมัติสิทธิ์การใช้งานจาก Admin" });
      }
      
      const passwordHash = hashPassword(password);
      if (foundUser.passwordHash !== passwordHash) {
        return responseJson({ success: false, error: "รหัสผ่านไม่ถูกต้อง" });
      }
      
      // Update last login
      const lastLogin = new Date().toISOString();
      sheet.getRange(userRowIndex, 6).setValue(lastLogin); // LastLogin is column 6 (F)
      
      return responseJson({
        success: true,
        user: {
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role
        }
      });
    }

    if (action === "getUsers") {
      const requesterEmail = String(postData.requesterEmail || "").trim().toLowerCase();
      let userSheet = ss.getSheetByName("Users");
      if (!userSheet) return responseJson({ success: false, error: "Users sheet not found" });
      
      const usersData = userSheet.getDataRange().getValues();
      let isRequesterAdmin = false;
      for (let i = 1; i < usersData.length; i++) {
        if (String(usersData[i][0]).toLowerCase() === requesterEmail && usersData[i][3] === "Admin") {
          isRequesterAdmin = true;
          break;
        }
      }
      
      if (!isRequesterAdmin) {
        return responseJson({ success: false, error: "ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin เท่านั้น)" });
      }
      
      const list = [];
      for (let i = 1; i < usersData.length; i++) {
        list.push({
          email: usersData[i][0],
          name: usersData[i][1],
          role: usersData[i][3] || "User",
          createdAt: usersData[i][4],
          lastLogin: usersData[i][5],
          status: usersData[i][6] || "Approved"
        });
      }
      return responseJson({ success: true, users: list });
    }

    if (action === "updateUserStatus") {
      const requesterEmail = String(postData.requesterEmail || "").trim().toLowerCase();
      const targetEmail = String(postData.targetEmail || "").trim().toLowerCase();
      const newStatus = String(postData.status || "");
      const newRole = String(postData.role || "");
      
      let userSheet = ss.getSheetByName("Users");
      if (!userSheet) return responseJson({ success: false, error: "Users sheet not found" });
      
      const usersData = userSheet.getDataRange().getValues();
      let isRequesterAdmin = false;
      for (let i = 1; i < usersData.length; i++) {
        if (String(usersData[i][0]).toLowerCase() === requesterEmail && usersData[i][3] === "Admin") {
          isRequesterAdmin = true;
          break;
        }
      }
      
      if (!isRequesterAdmin) {
        return responseJson({ success: false, error: "ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin เท่านั้น)" });
      }
      
      let targetRowIndex = -1;
      for (let i = 1; i < usersData.length; i++) {
        if (String(usersData[i][0]).toLowerCase() === targetEmail) {
          targetRowIndex = i + 1;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return responseJson({ success: false, error: "ไม่พบผู้ใช้ที่ต้องการอัปเดต" });
      }
      
      if (newStatus) {
        userSheet.getRange(targetRowIndex, 7).setValue(newStatus);
      }
      if (newRole) {
        userSheet.getRange(targetRowIndex, 4).setValue(newRole);
      }
      
      return responseJson({ success: true, message: "อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว!" });
    }

    if (action === "deleteUser") {
      const requesterEmail = String(postData.requesterEmail || "").trim().toLowerCase();
      const targetEmail = String(postData.targetEmail || "").trim().toLowerCase();
      
      if (requesterEmail === targetEmail) {
        return responseJson({ success: false, error: "คุณไม่สามารถลบบัญชีของตัวเองได้" });
      }
      
      let userSheet = ss.getSheetByName("Users");
      if (!userSheet) return responseJson({ success: false, error: "Users sheet not found" });
      
      const usersData = userSheet.getDataRange().getValues();
      let isRequesterAdmin = false;
      for (let i = 1; i < usersData.length; i++) {
        if (String(usersData[i][0]).toLowerCase() === requesterEmail && usersData[i][3] === "Admin") {
          isRequesterAdmin = true;
          break;
        }
      }
      
      if (!isRequesterAdmin) {
        return responseJson({ success: false, error: "ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin เท่านั้น)" });
      }
      
      let targetRowIndex = -1;
      for (let i = 1; i < usersData.length; i++) {
        if (String(usersData[i][0]).toLowerCase() === targetEmail) {
          targetRowIndex = i + 1;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return responseJson({ success: false, error: "ไม่พบผู้ใช้งานนี้" });
      }
      
      userSheet.deleteRow(targetRowIndex);
      return responseJson({ success: true, message: "ลบผู้ใช้เรียบร้อยแล้ว!" });
    }
    
    return responseJson({ success: false, error: "Unknown action" });
  } catch (error) {
    return responseJson({ success: false, error: error.toString() });
  }
}

// SHA-256 Hashing helper
function hashPassword(password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  let hash = "";
  for (let i = 0; i < digest.length; i++) {
    let byteVal = digest[i];
    if (byteVal < 0) byteVal += 256;
    let byteString = byteVal.toString(16);
    if (byteString.length == 1) byteString = "0" + byteString;
    hash += byteString;
  }
  return hash;
}
