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
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
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
    
    // Fallback if running as Owner in a personal Gmail context
    if (!userEmail) {
      return HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Configuration Required</title>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Sarabun', sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; }
            .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h2 { color: #f59e0b; margin-top: 0; font-size: 24px; }
            p { font-size: 15px; color: #94a3b8; line-height: 1.6; text-align: left; }
            ol { text-align: left; color: #cbd5e1; font-size: 14px; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ ต้องตั้งค่าการเข้าถึงเพิ่มเติม</h2>
            <p>ระบบตรวจไม่พบอีเมลบัญชี Google ของคุณ เนื่องจากนโยบายความเป็นส่วนตัวของกูเกิล กรุณาแจ้งผู้ดูแลระบบให้ทำการเปลี่ยนการตั้งค่าการ Deploy ดังนี้:</p>
            <ol>
              <li>ในหน้า Apps Script ให้กดปุ่ม <strong>Deploy > Manage deployments</strong></li>
              <li>กดสัญลักษณ์ดินสอเพื่อแก้ไขเว็บแอป</li>
              <li>เปลี่ยนหัวข้อ <strong>Execute as (เรียกใช้งานในฐานะ)</strong> จากเดิม "Me (ฉัน)" ให้เป็น <strong>"User accessing the web app (ผู้ใช้ที่เข้าถึงเว็บแอป)"</strong></li>
              <li>เปลี่ยนหัวข้อ <strong>Who has access (ผู้มีสิทธิ์เข้าถึง)</strong> ให้เป็น <strong>"Anyone with Google Account (ทุกคนที่มีบัญชี Google)"</strong></li>
              <li>กด <strong>Deploy</strong> อีกครั้ง</li>
            </ol>
            <p style="font-size: 12px; color: #64748b;">*หมายเหตุ: สเปรดชีตหลักจะต้องแชร์ให้ผู้ใช้สามารถแก้ไขได้ด้วย</p>
          </div>
        </body>
        </html>
      `).setTitle('Configuration Required - SLD STUDIO');
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 2. Check or Create Users table in Google Sheets
    let usersSheet = ss.getSheetByName("Users");
    if (!usersSheet) {
      usersSheet = ss.insertSheet("Users");
      usersSheet.appendRow(["Email", "Role", "ApprovedAt"]);
      // Add the active user (the creator/admin) as the first Admin
      usersSheet.appendRow([userEmail, "Admin", new Date().toISOString()]);
      usersSheet.setFrozenRows(1);
    }
    
    // 3. Verify user email in Users list
    const usersData = usersSheet.getDataRange().getValues();
    let isApproved = false;
    let userRole = "";
    
    for (let i = 1; i < usersData.length; i++) {
      const row = usersData[i];
      if (row[0] && row[0].toString().toLowerCase().trim() === userEmail.toLowerCase().trim()) {
        isApproved = true;
        userRole = row[1] || "User";
        break;
      }
    }
    
    // If user is not approved, show Access Denied page
    if (!isApproved) {
      const adminEmail = usersData[1] ? usersData[1][0] : "ผู้ดูแลระบบ";
      return HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Access Denied - SLD STUDIO</title>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Sarabun', sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; }
            .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h2 { color: #f43f5e; margin-top: 0; font-size: 24px; }
            p { font-size: 15px; color: #94a3b8; line-height: 1.6; }
            .email-box { background-color: #0f172a; border-radius: 8px; padding: 12px; margin: 20px 0; font-family: monospace; font-size: 16px; color: #38bdf8; font-weight: bold; border: 1px dashed #334155; }
            .admin-contact { font-size: 13px; color: #64748b; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ การเข้าถึงถูกปฏิเสธ (Access Denied)</h2>
            <p>บัญชี Google ของคุณยังไม่ได้รับอนุมัติให้ใช้งานระบบนี้:</p>
            <div class="email-box">${userEmail}</div>
            <p>กรุณาติดต่อผู้ดูแลระบบเพื่อขออนุมัติสิทธิ์การเข้าใช้งานโครงการ</p>
            <div class="admin-contact">อีเมลผู้ดูแลระบบ (Admin): ${adminEmail}</div>
          </div>
        </body>
        </html>
      `).setTitle('Access Denied - SLD STUDIO');
    }
    
    // 4. Handle API / Web App Requests
    const action = e.parameter.action;
    
    // If no action parameter, assume browser request and serve HTML UI
    if (!action) {
      return HtmlService.createHtmlOutputFromFile('Index')
          .setTitle('SLD STUDIO Pro - Solar Design Tool')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }
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
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
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
    
    return responseJson({ success: false, error: "Unknown action" });
  } catch (error) {
    return responseJson({ success: false, error: error.toString() });
  }
}
