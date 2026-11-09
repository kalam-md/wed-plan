/**
 * Wedding Tracker API (Google Apps Script)
 * - Sheet "Categories": daftar kategori (kolom A = nama, urutan = urutan baris)
 * - Satu sheet per kategori: kolom id | item | terpenuhi | harga
 * GET  -> semua data. POST -> {action, ...} (addCategory, renameCategory, deleteCategory, addItem, updateItem, deleteItem)
 */
var HEADERS = ['id', 'item', 'terpenuhi', 'harga'];
var CAT_SHEET = 'Categories';

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function catSheet_() {
  var s = ss_().getSheetByName(CAT_SHEET);
  if (!s) { s = ss_().insertSheet(CAT_SHEET); s.getRange(1, 1, 1, 1).setValues([['name']]).setFontWeight('bold'); }
  return s;
}
function catNames_() {
  var s = catSheet_(), n = s.getLastRow() - 1;
  if (n < 1) return [];
  return s.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }).filter(String);
}
function itemSheet_(name) {
  var s = ss_().getSheetByName(name);
  if (!s) throw new Error('Sheet "' + name + '" tidak ditemukan');
  return s;
}
function findRow_(sheet, id) {
  var n = sheet.getLastRow() - 1;
  if (n < 1) return -1;
  var ids = sheet.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}
function validName_(name) {
  name = String(name || '').trim();
  if (!name) throw new Error('Nama kategori wajib diisi');
  if (/[\[\]:*?\/\\]/.test(name) || name.length > 50) throw new Error('Nama kategori tidak valid');
  if (name === CAT_SHEET) throw new Error('Nama kategori tidak boleh "Categories"');
  return name;
}

function getAll_() {
  return catNames_().map(function (name) {
    var s = ss_().getSheetByName(name), items = [];
    if (s && s.getLastRow() > 1) {
      items = s.getRange(2, 1, s.getLastRow() - 1, 4).getValues()
        .filter(function (r) { return r[0] !== ''; })
        .map(function (r) { return { id: String(r[0]), item: String(r[1]), terpenuhi: r[2] === true || r[2] === 'TRUE', harga: Number(r[3]) || 0 }; });
    }
    return { name: name, items: items };
  });
}

function doGet() {
  try { return out_({ ok: true, data: getAll_() }); }
  catch (err) { return out_({ ok: false, error: String(err.message || err) }); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var b = JSON.parse(e.postData.contents), a = b.action;

    if (a === 'addCategory') {
      var name = validName_(b.name);
      if (catNames_().indexOf(name) > -1 || ss_().getSheetByName(name)) throw new Error('Kategori sudah ada');
      var s = ss_().insertSheet(name);
      s.getRange(1, 1, 1, 4).setValues([HEADERS]).setFontWeight('bold');
      s.setFrozenRows(1);
      s.getRange('D:D').setNumberFormat('#,##0');
      catSheet_().appendRow([name]);

    } else if (a === 'renameCategory') {
      var nn = validName_(b.newName);
      if (ss_().getSheetByName(nn)) throw new Error('Kategori sudah ada');
      itemSheet_(b.name).setName(nn);
      var cs = catSheet_(), names = catNames_(), idx = names.indexOf(b.name);
      if (idx > -1) cs.getRange(idx + 2, 1).setValue(nn);

    } else if (a === 'deleteCategory') {
      ss_().deleteSheet(itemSheet_(b.name));
      var cs2 = catSheet_(), idx2 = catNames_().indexOf(b.name);
      if (idx2 > -1) cs2.deleteRow(idx2 + 2);

    } else if (a === 'addItem') {
      itemSheet_(b.category).appendRow([b.id, b.item, false, Number(b.harga) || 0]);

    } else if (a === 'updateItem') {
      var sh = itemSheet_(b.category), row = findRow_(sh, b.id);
      if (row < 0) throw new Error('Item tidak ditemukan');
      if (b.item !== undefined) sh.getRange(row, 2).setValue(b.item);
      if (b.terpenuhi !== undefined) sh.getRange(row, 3).setValue(!!b.terpenuhi);
      if (b.harga !== undefined) sh.getRange(row, 4).setValue(Number(b.harga) || 0);

    } else if (a === 'deleteItem') {
      var sh2 = itemSheet_(b.category), r2 = findRow_(sh2, b.id);
      if (r2 > -1) sh2.deleteRow(r2);

    } else {
      throw new Error('Aksi tidak dikenal: ' + a);
    }
    SpreadsheetApp.flush();
    return out_({ ok: true, data: null });
  } catch (err) {
    return out_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}
