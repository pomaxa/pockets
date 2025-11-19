# CSV Import Guide - Revolut & Other Banks

## Overview

The Pockets app supports importing expenses from CSV files exported from Revolut and other banking apps. This allows you to quickly add multiple transactions without manual entry.

---

## 🚀 Quick Start

1. **Open Expenses Page**: Navigate to http://localhost:5173/app/expenses
2. **Click "Import CSV"**: Blue button in the top right
3. **Select your CSV file**: Choose the exported file from Revolut or your bank
4. **Preview & Select**: Review transactions and select which ones to import
5. **Import**: Click "Import X Expenses" to add them to your expenses

---

## 📁 Supported CSV Formats

### **Revolut Format** (Recommended)

Revolut CSV exports typically include these columns:
- **Date**: Transaction date (DD/MM/YYYY or YYYY-MM-DD)
- **Description**: Merchant or transaction description
- **Amount**: Transaction amount (negative for expenses)
- **Currency**: EUR, USD, etc.
- **Category**: Revolut's automatic categorization

**Example:**
```csv
Date,Description,Amount,Currency,Category
2024-11-18,Salary Payment,2000.00,EUR,Salary
2024-11-15,Rimi Supermarket,-45.50,EUR,Groceries
2024-11-14,Bolt Taxi,-12.80,EUR,Transport
2024-11-13,Netflix,-11.99,EUR,Entertainment
```

**Note:** In this example, only the 3 expenses (negative amounts) will be imported. The salary (positive amount) will be automatically skipped.

### **Generic CSV Format**

The parser also works with generic CSV files that have:
- A column with "date" in the header
- A column with "amount" or "price" in the header
- Optional: description/merchant column
- Optional: category column

**Minimum required format:**
```csv
Date,Amount
2024-11-15,45.50
2024-11-14,12.80
```

---

## 📥 How to Export from Revolut

### **Web App:**
1. Log in to https://app.revolut.com
2. Go to "Accounts" → Select account
3. Click "..." (More options)
4. Select "Export statement"
5. Choose date range
6. Format: **CSV**
7. Download the file

### **Mobile App:**
1. Open Revolut app
2. Go to "Accounts" → Select account
3. Tap on transaction history
4. Tap "..." or "Export" icon
5. Select "Statement"
6. Choose CSV format
7. Select date range
8. Share or save the file

---

## 🏷️ Category Mapping

The importer automatically maps Revolut categories to Pockets categories:

| Revolut Category | Pockets Category |
|-----------------|------------------|
| Groceries, Food, Dining, Restaurants | 🍔 Food |
| Transport, Taxi, Fuel, Parking | 🚗 Transport |
| Entertainment, Sport, Leisure | 🎉 Entertainment |
| Health, Pharmacy, Medical | 💊 Health |
| Home, Utilities, Bills | 💡 Utilities |
| Other | 📦 Other |

**Note:** You can manually change categories after importing if needed.

---

## ✨ Features

### **Smart Parsing**
- Auto-detects CSV format (Revolut or generic)
- Handles various date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
- Removes currency symbols automatically
- **Filters out income:** Only imports negative amounts (expenses)
- Converts negative amounts to positive for storage (e.g., -45.50 → 45.50)

### **Preview & Selection**
- See all transactions before importing
- Select/deselect individual transactions
- "Select All" / "Deselect All" buttons
- Shows: Date, Category, Description, Amount
- Imported expenses highlighted in green

### **Error Handling**
- Clear error messages if CSV is invalid
- Skips empty or invalid rows
- Shows which columns are missing
- Continues parsing even if some rows fail

---

## 🧪 Test Data

A sample Revolut CSV file is included at:
```
/sample-data/revolut-sample.csv
```

This file contains 15 sample transactions you can use to test the import feature.

**To use:**
1. Go to Expenses page
2. Click "Import CSV"
3. Select `revolut-sample.csv`
4. Preview and import

---

## 🔧 Troubleshooting

### **"CSV file is empty"**
- Check that the file contains data rows (not just headers)
- Ensure the file is actually a CSV (not Excel .xlsx)

### **"CSV must contain Date and Amount columns"**
- Verify your CSV has columns with "Date" and "Amount" in the header
- Column names are case-insensitive
- Acceptable variations: "date", "Date", "DATE", "amount", "Amount", "AMOUNT"

### **"No valid expenses found in CSV file"**
- Check that Amount column contains valid numbers
- Ensure dates are in a recognizable format
- Look for empty rows or formatting issues

### **Categories are all "Other"**
- This is normal for generic CSV files without a Category column
- You can manually change categories after importing
- Revolut exports with Category column will auto-map correctly

### **Dates are wrong**
- The parser supports multiple date formats
- Ambiguous dates (e.g., 01/02/2024) are assumed to be DD/MM/YYYY (European format)
- For best results, use YYYY-MM-DD format

---

## 💡 Tips & Best Practices

**Before Importing:**
1. ✅ Review your bank CSV in a text editor first
2. ✅ Check for unexpected formatting (extra commas, quotes)
3. ✅ Remove any summary rows at the bottom
4. ✅ Ensure expenses are negative (-45.50) in the source file
5. ✅ Income/positive amounts will be automatically filtered out

**During Import:**
1. ✅ Review the preview carefully before confirming
2. ✅ Income transactions are already filtered out automatically
3. ✅ Check category assignments
4. ✅ Verify dates are correct
5. ✅ Deselect any transactions you don't want to import

**After Importing:**
1. ✅ Review imported expenses in the Expenses list
2. ✅ Update categories if needed
3. ✅ Add missing descriptions
4. ✅ Delete duplicates if you imported the same file twice

---

## 🏦 Other Banks

While optimized for Revolut, the CSV importer works with most banks that export to CSV format:

**Tested Banks:**
- ✅ Revolut (Perfect match)
- ✅ Swedbank (Works with generic parser)
- ✅ SEB Bank (Works with generic parser)
- ✅ Luminor (Works with generic parser)
- ⚠️ Others: May work, but verify date and amount formats

**If your bank's CSV doesn't work:**
1. Check that it has Date and Amount columns
2. Try renaming columns to match (Date, Amount, Description)
3. Save as plain CSV (not Excel format)
4. Remove any extra header or footer rows

---

## 📊 CSV Format Specification

### **Minimum Required Columns:**
```csv
Date,Amount
```

### **Recommended Columns:**
```csv
Date,Description,Amount,Currency,Category
```

### **Supported Date Formats:**
- `YYYY-MM-DD` (e.g., 2024-11-15) ⭐ Recommended
- `DD/MM/YYYY` (e.g., 15/11/2024)
- `MM/DD/YYYY` (e.g., 11/15/2024)
- ISO format with time (e.g., 2024-11-15T10:30:00)

### **Amount Format:**
- **Expenses (imported):** Negative numbers: `-45.50`
- **Income (skipped):** Positive numbers: `+2000.00` or `2000.00`
- With currency symbol: `€45.50` or `-€45.50`
- Zero amounts: `0.00` (skipped)

**Important:** Only expenses (negative amounts) are imported. Income and positive amounts are automatically filtered out.

---

## 🔐 Privacy & Security

**Your data is safe:**
- ✅ CSV files are processed **entirely in your browser**
- ✅ **No data is sent to any server**
- ✅ All imported expenses are stored in **localStorage only**
- ✅ CSV files are **not uploaded anywhere**
- ✅ File processing happens **100% client-side**

**We never see:**
- Your CSV files
- Your transaction data
- Your bank information
- Any personal data

---

## 📝 Example: Creating a Custom CSV

If you want to manually create a CSV for import:

```csv
Date,Description,Amount,Category
2024-11-15,Weekly Groceries,45.50,Food
2024-11-14,Taxi to Airport,28.00,Transport
2024-11-13,Movie Tickets,18.00,Entertainment
2024-11-12,Pharmacy Items,12.50,Health
2024-11-11,Electric Bill,55.00,Utilities
```

Save this as a `.csv` file and import it!

---

## 🆘 Need Help?

If you encounter issues:

1. **Check this guide** for troubleshooting steps
2. **Try the sample CSV** to verify the feature works
3. **Inspect your CSV** in a text editor for formatting issues
4. **File an issue** on GitHub with:
   - Sample CSV (remove sensitive data)
   - Error message received
   - Browser you're using

---

## 🎯 Future Enhancements

Planned features:
- 🔄 Direct bank API integration (requires backend)
- 📱 Mobile app CSV import
- 🔗 Automatic duplicate detection
- 📈 Import statistics and summary
- 🎨 Custom category mapping rules
- 💾 Save import templates

---

**Last Updated:** 2024-11-19
**Version:** 1.0
