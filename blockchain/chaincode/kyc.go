package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


type SmartContract struct {
	contractapi.Contract
}


type IDStatus int

const (
	Active IDStatus = iota
	Inactive
	Suspended
)


type Tourist struct {
	RegisteredBy string   `json:"registeredby"`
	KycHash      string   `json:"kychash"`
	StartTime    int64    `json:"starttime"`
	EndTime      int64    `json:"endtime"`
	Time         int64    `json:"time"`
	TouristID    string   `json:"touristID"`
	Status       IDStatus `json:"status"`
}

func (s *SmartContract) RegisterTourist(ctx contractapi.TransactionContextInterface, kycHash string, touristID string, tourTime int64, status int) error {

	// Check if tourist already exists
	existing, err := ctx.GetStub().GetState(touristID)
	if err != nil {
		return fmt.Errorf("failed to read world state: %v", err)
	}
	if existing != nil {
		return fmt.Errorf("tourist already exists with ID: %s", touristID)
	}

	currentTime := time.Now().Unix()
	endTime := currentTime + tourTime

	// Get transaction creator
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client identity: %v", err)
	}

	tourist := Tourist{
		RegisteredBy: clientID,
		KycHash:      kycHash,
		StartTime:    currentTime,
		EndTime:      endTime,
		Time:         tourTime,
		TouristID:    touristID,
		Status:       IDStatus(status),
	}

	touristJSON, err := json.Marshal(tourist)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(touristID, touristJSON)
}

func (s *SmartContract) SuspendTourist(ctx contractapi.TransactionContextInterface, touristID string) error {
	touristJSON, err := ctx.GetStub().GetState(touristID)
	if err != nil {
		return fmt.Errorf("failed to read world state: %v", err)
	}
	if touristJSON == nil {
		return fmt.Errorf("tourist not found: %s", touristID)
	}

	var tourist Tourist
	err = json.Unmarshal(touristJSON, &tourist)
	if err != nil {
		return err
	}

	if tourist.Status == Suspended {
		return fmt.Errorf("tourist already suspended: %s", touristID)
	}

	tourist.Status = Suspended

	updatedJSON, err := json.Marshal(tourist)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(touristID, updatedJSON)
}


func (s *SmartContract) GetTouristByID(ctx contractapi.TransactionContextInterface, touristID string) (*Tourist, error) {
	touristJSON, err := ctx.GetStub().GetState(touristID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if touristJSON == nil {
		return nil, fmt.Errorf("tourist not found: %s", touristID)
	}

	var tourist Tourist
	err = json.Unmarshal(touristJSON, &tourist)
	if err != nil {
		return nil, err
	}

	return &tourist, nil
}


func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating KYC chaincode: %v", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting KYC chaincode: %v", err)
	}
}
