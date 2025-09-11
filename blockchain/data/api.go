package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
)

// ---------------- GLOBAL MASTER KEY ----------------
var masterKey = "kitkatisthebest@" // must be 16 bytes

// ---------------- Helpers ----------------
func PKCS5Padding(src []byte, blockSize int) []byte {
	padding := blockSize - len(src)%blockSize
	return append(src, bytes.Repeat([]byte{byte(padding)}, padding)...)
}
func PKCS5UnPadding(src []byte) []byte {
	length := len(src)
	unpadding := int(src[length-1])
	return src[:(length - unpadding)]
}

// Random number
func randomnumbergeneration(max int, min int) *big.Int {
	maxi := big.NewInt(int64(max))
	n, err := rand.Int(rand.Reader, maxi)
	if err != nil {
		panic(err)
	}
	if n.Cmp(big.NewInt(int64(min))) >= 0 {
		return n
	}
	return randomnumbergeneration(max, min)
}

// Generate random key + IV (16 chars each)
func generatekey() (string, string) {
	letters := "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	keyRunes := make([]rune, 16)
	ivRunes := make([]rune, 16)

	for i := 0; i < 16; i++ {
		keyRunes[i] = rune(letters[randomnumbergeneration(62, 0).Int64()])
		ivRunes[i] = rune(letters[randomnumbergeneration(62, 0).Int64()])
	}
	return string(keyRunes), string(ivRunes)
}

// ---------------- ECB encode/decode for Key + IV ----------------
func encodekey(plaintext string) string {
	block, err := aes.NewCipher([]byte(masterKey))
	if err != nil {
		panic(err)
	}

	plainTextBlock := PKCS5Padding([]byte(plaintext), aes.BlockSize)
	ciphertext := make([]byte, len(plainTextBlock))

	for start := 0; start < len(plainTextBlock); start += aes.BlockSize {
		block.Encrypt(ciphertext[start:start+aes.BlockSize], plainTextBlock[start:start+aes.BlockSize])
	}
	return base64.StdEncoding.EncodeToString(ciphertext)
}

func decodekey(encoded string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return "", fmt.Errorf("base64 decode: %w", err)
	}

	block, err := aes.NewCipher([]byte(masterKey))
	if err != nil {
		return "", err
	}
	if len(data)%aes.BlockSize != 0 {
		return "", fmt.Errorf("ciphertext not multiple of block size")
	}

	out := make([]byte, len(data))
	for start := 0; start < len(data); start += aes.BlockSize {
		block.Decrypt(out[start:start+aes.BlockSize], data[start:start+aes.BlockSize])
	}
	out = PKCS5UnPadding(out)
	return string(out), nil
}

func GetAESEncrypted(plaintext string) (string, error) {
	key, iv := generatekey()

	plainTextBlock := PKCS5Padding([]byte(plaintext), aes.BlockSize)
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	ciphertext := make([]byte, len(plainTextBlock))
	mode := cipher.NewCBCEncrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, plainTextBlock)

	encodedKey := encodekey(key)
	encodedIV := encodekey(iv)
	ciphertextBase64 := base64.StdEncoding.EncodeToString(ciphertext)

	return encodedIV + ciphertextBase64 + encodedKey, nil
}

func GetAESDecrypted(encrypted string) ([]byte, error) {
	encodedIVLen := base64.StdEncoding.EncodedLen(32)
	encodedKeyLen := base64.StdEncoding.EncodedLen(32)

	if len(encrypted) < encodedIVLen+encodedKeyLen {
		return nil, fmt.Errorf("invalid encrypted data length")
	}

	encodedIV := encrypted[:encodedIVLen]
	encodedKey := encrypted[len(encrypted)-encodedKeyLen:]
	ciphertextBase64 := encrypted[encodedIVLen : len(encrypted)-encodedKeyLen]

	iv, err := decodekey(encodedIV)
	if err != nil {
		return nil, fmt.Errorf("decode IV: %w", err)
	}
	key, err := decodekey(encodedKey)
	if err != nil {
		return nil, fmt.Errorf("decode Key: %w", err)
	}

	ciphertext, err := base64.StdEncoding.DecodeString(ciphertextBase64)
	if err != nil {
		return nil, fmt.Errorf("base64 decode ciphertext: %w", err)
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return nil, err
	}
	if len(ciphertext)%aes.BlockSize != 0 {
		return nil, fmt.Errorf("ciphertext not multiple of block size")
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, ciphertext)

	plaintext := PKCS5UnPadding(ciphertext)
	return plaintext, nil
}


type EncryptRequest struct {
	Data string `json:"data"`
}
type EncryptResponse struct {
	Encrypted string `json:"encrypted"`
}
type DecryptRequest struct {
	Encrypted string `json:"encrypted"`
}
type DecryptResponse struct {
	Decrypted string `json:"decrypted"`
}

func encryptHandler(w http.ResponseWriter, r *http.Request) {
	var req EncryptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	encrypted, err := GetAESEncrypted(req.Data)
	if err != nil {
		http.Error(w, "encryption failed", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(EncryptResponse{Encrypted: encrypted})
}

func decryptHandler(w http.ResponseWriter, r *http.Request) {
	var req DecryptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	decrypted, err := GetAESDecrypted(req.Encrypted)
	if err != nil {
		http.Error(w, "decryption failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(DecryptResponse{Decrypted: string(decrypted)})
}


func main() {
	http.HandleFunc("/encrypt", encryptHandler)
	http.HandleFunc("/decrypt", decryptHandler)

	fmt.Println("AES API running at http://localhost:8181")
	log.Fatal(http.ListenAndServe("0.0.0.0:8181", nil))
}
