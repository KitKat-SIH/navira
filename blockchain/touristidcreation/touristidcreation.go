package main

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"
    "strconv"
    "net/http"
    "log"
    "encoding/json"
)
func randomnumbergeneration() (*big.Int){
    max := big.NewInt(999999)
    n, err := rand.Int(rand.Reader, max)
    if err != nil {
        panic(err)
    }
    if n.Cmp(big.NewInt(10000)) > 0{
        return n
    } else {
        return randomnumbergeneration()
    }
}

func createTouristID() string {
    touristid := "T"+strconv.Itoa(time.Now().Year())+ strconv.Itoa(int(time.Now().Month()))+"-"+strconv.Itoa(int(randomnumbergeneration().Int64()))
    return touristid
}
func handler(w http.ResponseWriter, r *http.Request) {
	touristID := createTouristID() // use your original function
	resp := map[string]string{
		"touristID": touristID,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.HandleFunc("/generate", handler)
	fmt.Println("Tourist ID API running on http://localhost:8080/generate")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
