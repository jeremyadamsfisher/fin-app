package main

import (
    "log"

    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/core"
	"github.com/jeremyadamsfisher/fin-app/handlers"
)

// busting cache...

func main() {
    app := pocketbase.New()
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/amex/csv", handlers.UploadAmexCSVHandler)
		return nil
	})
    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}