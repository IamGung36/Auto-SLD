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
    if (!dbSheet) {
      dbSheet = ss.insertSheet("Data base");
      dbSheet.appendRow(["Database Status", "Updated At", "Version"]);
      dbSheet.appendRow(["Connected", new Date().toISOString(), "1.0"]);
    }

    // Action 2: Get standard Database Tables
    const db = {
      cables: {},
      ampacity: {},
      cableOD: {},
      conduitSizes: [],
      traySizes: []
    };
    
    // 1. Parse Cables
    const cablesSheet = ss.getSheetByName("Cables");
    if (cablesSheet) {
      const rows = cablesSheet.getDataRange().getValues();
      if (rows.length > 1) {
        const headers = rows[0]; // CableType, Size, R, X
        for (let i = 1; i < rows.length; i++) {
          const type = rows[i][0];
          const size = String(rows[i][1]);
          const r = String(rows[i][2]);
          const x = String(rows[i][3]);
          
          if (!db.cables[type]) db.cables[type] = [];
          db.cables[type].push({ size, r, x });
        }
      }
    }
    
    // 2. Parse Ampacity
    const ampacitySheet = ss.getSheetByName("Ampacity");
    if (ampacitySheet) {
      const rows = ampacitySheet.getDataRange().getValues();
      if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          const type = rows[i][0];
          const install = rows[i][1];
          const cores = rows[i][2];
          const size = String(rows[i][3]);
          const amp = Number(rows[i][4]);
          
          if (!db.ampacity[type]) db.ampacity[type] = {};
          if (!db.ampacity[type][install]) db.ampacity[type][install] = {};
          if (!db.ampacity[type][install][cores]) db.ampacity[type][install][cores] = {};
          db.ampacity[type][install][cores][size] = amp;
        }
      }
    }
    
    // 3. Parse CableOD
    const odSheet = ss.getSheetByName("CableOD");
    if (odSheet) {
      const rows = odSheet.getDataRange().getValues();
      if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          const size = String(rows[i][0]);
          const cores = rows[i][1];
          const od = Number(rows[i][2]);
          
          if (!db.cableOD[size]) db.cableOD[size] = {};
          db.cableOD[size][cores] = od;
        }
      }
    }
    
    // 4. Parse Conduits
    const conduitSheet = ss.getSheetByName("Conduits");
    if (conduitSheet) {
      const rows = conduitSheet.getDataRange().getValues();
      if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          db.conduitSizes.push({
            size: String(rows[i][0]),
            id: Number(rows[i][1]),
            area40: Number(rows[i][2])
          });
        }
      }
    }
    
    // 5. Parse Trays
    const traySheet = ss.getSheetByName("Trays");
    if (traySheet) {
      const rows = traySheet.getDataRange().getValues();
      if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
          const sz = Number(rows[i][0]);
          if (!isNaN(sz)) db.traySizes.push(sz);
        }
      }
    }
    
    return responseJson({ success: true, db });
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
      
      // Ensure 'Data base' sheet exists and update status
      let dbSheet = ss.getSheetByName("Data base");
      if (!dbSheet) {
        dbSheet = ss.insertSheet("Data base");
      }
      dbSheet.clear();
      dbSheet.appendRow(["Database Status", "Updated At", "Version"]);
      dbSheet.appendRow(["Connected", new Date().toISOString(), "1.0"]);
      
      // Save Cables
      if (db.cables) {
        let cablesSheet = ss.getSheetByName("Cables");
        if (!cablesSheet) {
          cablesSheet = ss.insertSheet("Cables");
        }
        cablesSheet.clear();
        cablesSheet.appendRow(["CableType", "Size", "R", "X"]);
        cablesSheet.setFrozenRows(1);
        const rows = [];
        for (const type in db.cables) {
          db.cables[type].forEach(c => {
            rows.push([type, c.size, c.r, c.x]);
          });
        }
        if (rows.length > 0) {
          cablesSheet.getRange(2, 1, rows.length, 4).setValues(rows);
        }
      }
      
      // Save Ampacity
      if (db.ampacity) {
        let ampacitySheet = ss.getSheetByName("Ampacity");
        if (!ampacitySheet) {
          ampacitySheet = ss.insertSheet("Ampacity");
        }
        ampacitySheet.clear();
        ampacitySheet.appendRow(["CableType", "Installation", "Cores", "Size", "Amp"]);
        ampacitySheet.setFrozenRows(1);
        const rows = [];
        for (const type in db.ampacity) {
          for (const install in db.ampacity[type]) {
            for (const cores in db.ampacity[type][install]) {
              for (const size in db.ampacity[type][install][cores]) {
                const amp = db.ampacity[type][install][cores][size];
                rows.push([type, install, cores, size, amp]);
              }
            }
          }
        }
        if (rows.length > 0) {
          ampacitySheet.getRange(2, 1, rows.length, 5).setValues(rows);
        }
      }
      
      // Save CableOD
      if (db.cableOD) {
        let odSheet = ss.getSheetByName("CableOD");
        if (!odSheet) {
          odSheet = ss.insertSheet("CableOD");
        }
        odSheet.clear();
        odSheet.appendRow(["Size", "Cores", "OD"]);
        odSheet.setFrozenRows(1);
        const rows = [];
        for (const size in db.cableOD) {
          for (const cores in db.cableOD[size]) {
            const od = db.cableOD[size][cores];
            rows.push([size, cores, od]);
          }
        }
        if (rows.length > 0) {
          odSheet.getRange(2, 1, rows.length, 3).setValues(rows);
        }
      }
      
      // Save Conduits
      if (db.conduitSizes) {
        let conduitSheet = ss.getSheetByName("Conduits");
        if (!conduitSheet) {
          conduitSheet = ss.insertSheet("Conduits");
        }
        conduitSheet.clear();
        conduitSheet.appendRow(["Size", "ID", "Area40"]);
        conduitSheet.setFrozenRows(1);
        const rows = [];
        db.conduitSizes.forEach(c => {
          rows.push([c.size, c.id, c.area40]);
        });
        if (rows.length > 0) {
          conduitSheet.getRange(2, 1, rows.length, 3).setValues(rows);
        }
      }
      
      // Save Trays
      if (db.traySizes) {
        let traySheet = ss.getSheetByName("Trays");
        if (!traySheet) {
          traySheet = ss.insertSheet("Trays");
        }
        traySheet.clear();
        traySheet.appendRow(["Size"]);
        traySheet.setFrozenRows(1);
        const rows = [];
        db.traySizes.forEach(sz => {
          rows.push([sz]);
        });
        if (rows.length > 0) {
          traySheet.getRange(2, 1, rows.length, 1).setValues(rows);
        }
      }
      
      return responseJson({ success: true, message: "Database saved successfully" });
    }

    if (action === "register") {
      let sheet = ss.getSheetByName("Users");
      if (!sheet) {
        sheet = ss.insertSheet("Users");
        sheet.appendRow(["Email", "Name", "PasswordHash", "Role", "CreatedAt", "LastLogin"]);
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
      
      sheet.appendRow([email, name, passwordHash, role, createdAt, ""]);
      
      return responseJson({ success: true, message: "สมัครสมาชิกสำเร็จ!" });
    }

    if (action === "loginUser") {
      let sheet = ss.getSheetByName("Users");
      if (!sheet) {
        // If Users sheet doesn't exist, create it and register an Admin user as a fallback
        sheet = ss.insertSheet("Users");
        sheet.appendRow(["Email", "Name", "PasswordHash", "Role", "CreatedAt", "LastLogin"]);
        sheet.setFrozenRows(1);
        
        // Pre-populate admin account
        const adminEmail = "admin@admin.com";
        const adminName = "System Administrator";
        const adminHash = hashPassword("admin123");
        sheet.appendRow([adminEmail, adminName, adminHash, "Admin", new Date().toISOString(), ""]);
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
            role: data[i][3] || "User"
          };
          userRowIndex = i + 1; // 1-indexed
          break;
        }
      }
      
      if (!foundUser && email === "admin@admin.com") {
        const adminEmail = "admin@admin.com";
        const adminName = "System Administrator";
        const adminHash = hashPassword("admin123");
        sheet.appendRow([adminEmail, adminName, adminHash, "Admin", new Date().toISOString(), ""]);
        
        foundUser = {
          email: adminEmail,
          name: adminName,
          passwordHash: adminHash,
          role: "Admin"
        };
        userRowIndex = sheet.getLastRow();
      }
      
      if (!foundUser) {
        return responseJson({ success: false, error: "ไม่พบบัญชีผู้ใช้งานนี้" });
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
