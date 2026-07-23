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
