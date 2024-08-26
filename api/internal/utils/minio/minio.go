package minio

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"sync"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var (
	instance *MinioClient
	once     sync.Once
)

type MinioClient struct {
	client *minio.Client
	bucket string
}

func InitMinioClient(endpoint, accessKeyID, secretAccessKey, bucket string) error {
	var err error
	once.Do(func() {
		client, initErr := minio.New(endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
			Secure: false, // Set to true if you're using HTTPS
		})
		if initErr != nil {
			err = initErr
			return
		}
		instance = &MinioClient{
			client: client,
			bucket: bucket,
		}
	})
	return err
}

func GetMinioClient() *MinioClient {
	if instance == nil {
		panic("MinioClient not initialized. Call InitMinioClient first.")
	}
	return instance
}

func (m *MinioClient) UploadFile(base64Data, fileExtension string) (string, error) {
	// Decode base64 data
	decodedData, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64 data: %w", err)
	}

	// Generate a unique filename with the provided extension
	fileName := fmt.Sprintf("%d.%s", time.Now().UnixNano(), fileExtension)

	// Upload the file to MinIO
	_, err = m.client.PutObject(context.Background(), m.bucket, fileName, bytes.NewReader(decodedData), int64(len(decodedData)), minio.PutObjectOptions{ContentType: "application/octet-stream"})
	if err != nil {
		return "", fmt.Errorf("failed to upload to MinIO: %w", err)
	}

	// Generate and return the URL
	return fmt.Sprintf("http://%s/%s/%s", m.client.EndpointURL().Host, m.bucket, fileName), nil
}