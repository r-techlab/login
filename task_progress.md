# Task Progress: Unit Selection Enhancement

- [x] Analyze current codebase and understand requirements
- [x] Confirm backend API support for StockUnits
- [x] Confirm `apiGetStockUnits` function exists in api.js
- [x] Modify `openingstockform.htm` - Replace disabled unit input with select dropdown
- [x] Modify `openingstockform.htm` - Update `addDetailLine()` to load units when data exists
- [x] Modify `openingstockform.htm` - Update `selectStock()` to call `loadStockUnits()`
- [x] Modify `openingstockform.htm` - Add `loadStockUnits()` function to fetch and populate unit dropdown
- [x] Modify `openingstockform.htm` - `getFormData()` already reads from select (no change needed)
- [x] Modify `openingstockform.htm` - `loadOpeningStockData()` already works (calls addDetailLine with data)
- [x] Verify no other forms need the same change
- [x] Fix `loadStockUnits()` to use `unitCode` from StockMaster as the base unit instead of assuming first record
- [x] Fix `loadStockUnits()` to look up base unit from `allStocks` array and always include it in dropdown
- [x] Apply same changes to `purchaseform.htm`
- [x] Apply same changes to `salesform.htm`
- [x] Fix `openingstockform.htm` - stock search dropdown was clipped by `.table-container` overflow (list grew inside the table); switched to body-appended `position: fixed` dropdown with `maxHeight: 200px`, `overflowY: auto`, `zIndex: 10000` and scroll/resize repositioning (same pattern as `purchaseform.htm`/`salesform.htm`)
- [x] Apply same stock search dropdown fix to `stockadjustmentform.htm`
- [x] Add IndexedDB "Refresh Data" support to `openingstockform.htm` - `#refreshBtn` header button + `refreshMasterData()` (calls `refreshMasterDataFromServer()` then re-reads stocks via `getStocksFromDB()`), same as `purchaseform.htm`/`salesform.htm`
- [x] Add IndexedDB "Refresh Data" support to `stockadjustmentform.htm` - same `#refreshBtn` button and `refreshMasterData()` function
- [x] Add `loadStocks()` API-failure warning ("Click \"Refresh Data\" to retry.") to both forms, matching `purchaseform.htm`

# Task Progress: Opening Stock / Stock Adjustment form open performance

- [x] Diagnosed the slow "New" form open: `generateDocNo()` in `openingstockform.htm` / `stockadjustmentform.htm` fired 2 sequential Apps Script calls (`getOpeningStocks` / `getStockAdjustments`) and the form stayed hidden until they finished
- [x] Confirmed `loadStocks()` in both forms was already IndexedDB-first (identical to `purchaseform.htm` / `salesform.htm`) - no change needed there
- [x] Removed `generateDocNo()` from `openingstockform.htm` and un-wrapped the New-form flow - the form now renders as soon as the IndexedDB master data is ready
- [x] Removed `generateDocNo()` from `stockadjustmentform.htm` (same change)
- [x] DocNo is now assigned by the server on save - `handleCreateOpeningStockGet` / `handleCreateStockAdjustmentGet` already return `result.docNo`, which `saveOpeningStock()` / `saveStockAdjustment()` already write back to the Doc No field
- [x] `indexedDB.js` - bumped `DB_VERSION` 6 -> 7 and registered the new `stockUnits` object store (keyPath `stockCode`)
- [x] `indexedDB.js` - added `saveStockUnitsToDB()`, `getStockUnitsFromDB()` (null on cache miss; a cached empty array means "stock has no extra units") and `clearStockUnitsFromDB(stockCode)`
- [x] `indexedDB.js` - `refreshMasterDataFromServer()` now clears the cached stock units too
- [x] `openingstockform.htm` / `stockadjustmentform.htm` / `purchaseform.htm` / `salesform.htm` - `loadStockUnits()` reads IndexedDB first and only calls `apiGetStockUnits` on a cache miss, then caches the result per stock code
- [x] `stockmaster.htm` - `loadStockUnits()` now refreshes the cached units with its fresh server data; adding/removing a unit conversion invalidates that stock's cache; deleting a stock drops its cached unit conversions
- [x] `stockmaster.htm` - `loadStocks()` now refreshes the `stocks` IndexedDB cache with its fresh server data, so the transaction forms never show stale stock master data
