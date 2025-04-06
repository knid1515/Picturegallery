let CURRENT_FOLDER_ID = '1hm7WZ4YMN6S9rprVQXEjdLAriAvQ4N1Q';
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle("แกลเลอรีภาพจาก Google Drive")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getGalleryHtml(folderId) {
  CURRENT_FOLDER_ID = folderId || CURRENT_FOLDER_ID;
  try {
    const folder = DriveApp.getFolderById(CURRENT_FOLDER_ID);
    const files = folder.getFiles();
    let html = '';

    while (files.hasNext()) {
      const file = files.next();
      const id = file.getId();
      const name = file.getName();
      const viewUrl = `https://lh3.googleusercontent.com/d/${id}`;
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      html += `
        <div class="card" onclick="openModal('${viewUrl}', '${name}', '${downloadUrl}', '${id}')">
          <img src="${viewUrl}" alt="${name}">
          <div class="caption">${name}</div>
        </div>
      `;
    }

    return html || '<p style="text-align:center;">ไม่มีรูปภาพในโฟลเดอร์นี้</p>';
  } catch (e) {
    return `<p style="color:red; text-align:center;">ไม่พบโฟลเดอร์ ID นี้: ${folderId}</p>`;
  }
}

function deleteFile(fileId) {
  const file = DriveApp.getFileById(fileId);
  file.setTrashed(true);
}
function saveUserFolderId(folderId) {
  PropertiesService.getUserProperties().setProperty("savedFolderId", folderId);
}

function getUserFolderId() {
  return PropertiesService.getUserProperties().getProperty("savedFolderId");
}
