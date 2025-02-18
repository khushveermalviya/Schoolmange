-- CREATE TABLE ExpenseCategories (
--     CategoryID INT IDENTITY(1,1) PRIMARY KEY,
--     CategoryName VARCHAR(50) NOT NULL,
--     Description VARCHAR(200)
-- );

-- -- Create Expenses Table
-- CREATE TABLE Expenses (
--     ExpenseID INT IDENTITY(1,1) PRIMARY KEY,
--     CategoryID INT FOREIGN KEY REFERENCES ExpenseCategories(CategoryID),
--     Amount DECIMAL(10,2) NOT NULL,
--     Description VARCHAR(200),
--     ReceiptURL VARCHAR(500),
--     ExpenseDate DATE NOT NULL,
--     CreatedAt DATETIME DEFAULT GETDATE(),
--     UpdatedAt DATETIME DEFAULT GETDATE()
-- );

-- -- Insert Default Categories
-- INSERT INTO ExpenseCategories (CategoryName, Description)
-- VALUES 
--     ('Stationery', 'Office supplies and stationery items'),
--     ('Labor', 'Labor and workforce expenses'),
--     ('Repairs', 'Maintenance and repair costs'),
--     ('Utilities', 'Regular utility expenses'),
--     ('Miscellaneous', 'Other expenses');
SELECT * FROM Expenses;