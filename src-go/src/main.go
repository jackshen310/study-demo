// You can edit this code!
// Click here and start typing.
package main

import (
	"log"
	"net/http"
	"text/template"
)

func check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
func viewHandler(writer http.ResponseWriter, request *http.Request) {
	message := []byte("hello world")
	_, err := writer.Write(message)
	check(err)
}
func viewHandler2(writer http.ResponseWriter, request *http.Request) {
	html, err := template.ParseFiles("./src/view.html")
	check(err)
	err = html.Execute(writer, nil)
	check(err)
}
func main() {
	http.HandleFunc("/hello", viewHandler)
	http.HandleFunc("/guessbook", viewHandler2)
	err := http.ListenAndServe("localhost:8080", nil)
	log.Fatal((err))
}
