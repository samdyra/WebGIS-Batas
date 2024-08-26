package report

import (
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/samdyra/go-geo/internal/utils/errors"
	"github.com/samdyra/go-geo/internal/utils/minio"
)

type ReportService struct {
	db *sqlx.DB
}

func NewReportService(db *sqlx.DB) *ReportService {
	return &ReportService{db: db}
}

func (s *ReportService) GetReports() ([]Report, error) {
	var reports []Report
	err := s.db.Select(&reports, "SELECT * FROM report ORDER BY created_at DESC")
	if err != nil {
		return nil, errors.ErrInternalServer
	}
	return reports, nil
}

func (s *ReportService) GetReportByID(id int64) (*Report, error) {
	var report Report
	err := s.db.Get(&report, "SELECT * FROM report WHERE id = $1", id)
	if err == sql.ErrNoRows {
		return nil, errors.ErrNotFound
	}
	if err != nil {
		return nil, errors.ErrInternalServer
	}
	return &report, nil
}

func (s *ReportService) CreateReport(input CreateReportInput) (*Report, error) {
    minioClient := minio.GetMinioClient()
    dataURL, err := minioClient.UploadFile(input.DataFile, input.FileExtension)
    if err != nil {
        log.Printf("Error uploading file to MinIO: %v", err)
        return nil, errors.ErrInternalServer
    }

    report := &Report{
        ReporterName: input.ReporterName,
        Email:        input.Email,
        Description:  input.Description,
        DataURL:      &dataURL,
        CreatedAt:    time.Now(),
    }

    query := `INSERT INTO report (reporter_name, email, description, data_url, created_at) 
              VALUES ($1, $2, $3, $4, $5) RETURNING id`
    err = s.db.QueryRow(query, report.ReporterName, report.Email, report.Description, report.DataURL, report.CreatedAt).
        Scan(&report.ID)
    if err != nil {
        log.Printf("Error creating report: %v", err)
        return nil, errors.ErrInternalServer
    }

    return report, nil
}

func (s *ReportService) UpdateReport(id int64, input UpdateReportInput) (*Report, error) {
	report, err := s.GetReportByID(id)
	if err != nil {
		return nil, err
	}

	if input.ReporterName != nil {
		report.ReporterName = *input.ReporterName
	}
	if input.Email != nil {
		report.Email = *input.Email
	}
	if input.Description != nil {
		report.Description = *input.Description
	}
	if input.DataFile != nil {
		minioClient := minio.GetMinioClient()
		dataURL, err := minioClient.UploadFile(*input.DataFile, *input.FileExtension)
		if err != nil {
			log.Printf("Error uploading file to MinIO: %v", err)
			return nil, errors.ErrInternalServer
		}
		report.DataURL = &dataURL
	}

	query := `UPDATE report SET reporter_name = $1, email = $2, description = $3, data_url = $4 WHERE id = $5`
	_, err = s.db.Exec(query, report.ReporterName, report.Email, report.Description, report.DataURL, id)
	if err != nil {
		return nil, errors.ErrInternalServer
	}

	return report, nil
}

func (s *ReportService) DeleteReport(id int64) error {
	// First, get the report to retrieve the DataURL
	report, err := s.GetReportByID(id)
	if err != nil {
		return err
	}

	// Delete the file from MinIO if DataURL exists
	if report.DataURL != nil && *report.DataURL != "" {
		minioClient := minio.GetMinioClient()
		objectName := extractObjectNameFromURL(*report.DataURL)
		err = minioClient.DeleteFile(objectName)
		if err != nil {
			log.Printf("Error deleting file from MinIO: %v", err)

			return errors.ErrInternalServer
		}
	}

	// Delete the report from the database
	_, err = s.db.Exec("DELETE FROM report WHERE id = $1", id)
	if err != nil {
		return errors.ErrInternalServer
	}

	return nil
}

func extractObjectNameFromURL(url string) string {
	parts := strings.Split(url, "/")
	return parts[len(parts)-1]
}