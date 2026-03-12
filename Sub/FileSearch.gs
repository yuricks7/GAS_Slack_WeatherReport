/**
 * 重複ファイルがあればリストを更新する
 * 
 * 【参考】
 *  - 【GASで整理】ドライブ上の同名のファイルを検索する - myfunc.jp
 *     https://myfunc.jp/items/00145/index.html
 */
function hasDuplicateFileName() {
  // 指定フォルダに存在するファイルすべてを再帰的に取得する
  let allFiles = [];
  const props = new Props();
  const folderId = props.folderId;
  const rootFolder = DriveApp.getFolderById(folderId);
  allFiles = addFiles(rootFolder, allFiles);
  allFiles = addFilesFromRootFolder(rootFolder, allFiles); // 起点フォルダ内のファイルも追加

  // 重複したファイルの情報を取得
  const duplicateNames = scanDuplicateNames(allFiles);
  const duplicateFiles = scanDuplicateFiles(duplicateNames, allFiles);
  console.log(duplicateFiles);
}

/**
 * ファイルを取得する
 * 
 * @param {DriveApp.Folder} rootFolder - ファイルを探すフォルダ
 * @param {[][]}            allFiles   - ファイル名とURLを格納した二次元配列
 * 
 * @return {[][]} - ファイル名とURLを格納した二次元配列
 */
function addFiles(rootFolder, allFiles) {
  // フォルダ内のファイルを取得
  let folders = rootFolder.getFolders();
  while (folders.hasNext()) {
    let folder = folders.next();
    let files  = folder.getFiles();

    // 結果の配列に追加する
    while (files.hasNext()) {
      let file     = files.next();
      let fileName = file.getName();
      let fileUrl  = file.getUrl();
      allFiles.push([fileName, fileUrl]);
    }

    // 再帰的にフォルダを探す
    addFiles(folder, allFiles);
  }

  // 指定フォルダ以下のすべてのファイル一覧を返す
  return allFiles;
}

/**
 * 起点フォルダ内のファイルを追加
 * 
 * @param {DriveApp.Folder} rootFolder - ファイル名とURLを格納した二次元配列
 * @param {[][]}            allFiles   - ファイル名とURLを格納した二次元配列
 * 
 * @return {[]} - 重複したファイルのファイル名を格納した一次元配列
 */
function addFilesFromRootFolder(rootFolder, allFiles) {
  let rootFolderFiles = rootFolder.getFiles();
  while (rootFolderFiles.hasNext()) {
    let file = rootFolderFiles.next();
    let fileName = file.getName();
    let fileUrl  = file.getUrl();

    allFiles.push([fileName, fileUrl]);
  }

  return allFiles;
}

/**
 * 重複したファイル名を探す
 * 
 * @param {[][]} allFiles - ファイル名とURLを格納した二次元配列
 * 
 * @return {[]} - 重複したファイルのファイル名を格納した一次元配列
 */
function scanDuplicateNames(allFiles) {
  const newNames = []; // ファイル名を一時的に格納する配列。
  const duplicateNames = [];
  for (let i = 0; i < allFiles.length; i++) {
    const fileName = allFiles[i][0];

    // ファイル名がnewNamesにすでにある = 2回目以降の出現。
    if (!newNames.includes(fileName)) {
      newNames.push(fileName);
      continue;
    }

    // 重複リストにまだ無ければ、リストに追加
    if (duplicateNames.includes(fileName)) continue;
    duplicateNames.push(fileName);
  }

  return duplicateNames;
}

/**
 * 重複したファイルを探す
 * 
 * @param {[]}   duplicateNames - ファイル名を格納した一次元配列
 * @param {[][]} allFiles       - ファイル名とURLを格納した二次元配列
 * 
 * @return {[][]} - 重複したファイルのファイル名とURLを格納した二次元配列
 */
function scanDuplicateFiles(duplicateNames, allFiles) {
  const duplicateFiles = [];
  for (let i = 0; i < duplicateNames.length; i++) {
    for (let j = 0; j < allFiles.length; j++) {
      // 重複ファイル名とすべてのファイルリストの名前が一致したら配列に追加
      let fileInfo = allFiles[j];
      if (duplicateNames[i] == fileInfo[0]) {
        duplicateFiles.push(fileInfo);
      }
    }
  }

  return duplicateFiles;
}