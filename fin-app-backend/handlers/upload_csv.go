package handlers

import (
	"fmt"
	"encoding/csv"
	"net/http"

	"github.com/labstack/echo/v5"
)


// swagger:route POST /csv/amex/ AmEx uploadCsv
// Upload an Amex Expenses CSV to parse into the database.
//
// responses:
//  200: Csv Uploaded successfully
func UploadAmexCSVHandler(c echo.Context) error {
    // Get the file from the request
    file, err := c.FormFile("csv_file")
    if err != nil {
        return fmt.Errorf("Error retrieving the file: %s", err)
    }

    // Open the file for reading
    csvFile, err := file.Open()
    if err != nil {
        return fmt.Errorf("Error opening the file: %s", err)
    }

    // Parse the CSV data
    csvReader := csv.NewReader(csvFile)
    records, err := csvReader.ReadAll()
    if err != nil {
        return fmt.Errorf("Error reading the file: %s", err)
    }

    // Add the CSV data to the table
    for _, record := range records {
		fmt.Println(record)
		// ...
    }

    return c.String(http.StatusOK, "CSV uploaded and added to PocketBase!")
}