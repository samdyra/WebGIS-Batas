package report

import (
	"regexp"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

type Report struct {
	ID           int64     `db:"id" json:"id"`
	ReporterName string    `db:"reporter_name" json:"reporter_name"`
	Email        string    `db:"email" json:"email"`
	Description  string    `db:"description" json:"description"`
	DataURL      *string   `db:"data_url" json:"data_url,omitempty"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

type CreateReportInput struct {
	ReporterName  string `json:"reporter_name"`
	Email         string `json:"email"`
	Description   string `json:"description"`
	DataFile      string `json:"data_file"` // This will contain the base64 encoded file
	FileExtension string `json:"file_extension"` // New field for file extension
}

type UpdateReportInput struct {
	ReporterName  *string `json:"reporter_name,omitempty"`
	Email         *string `json:"email,omitempty"`
	Description   *string `json:"description,omitempty"`
	DataFile      *string `json:"data_file,omitempty"` // This will contain the base64 encoded file
	FileExtension *string `json:"file_extension,omitempty"` // New field for file extension
}

var fileExtensionRegex = regexp.MustCompile(`^[a-zA-Z0-9]+$`)

func (i CreateReportInput) Validate() error {
	return validation.ValidateStruct(&i,
		validation.Field(&i.ReporterName, validation.Required, validation.Length(1, 255)),
		validation.Field(&i.Email, validation.Required, is.Email),
		validation.Field(&i.Description, validation.Required),
		validation.Field(&i.DataFile, validation.Required),
		validation.Field(&i.FileExtension, validation.Required, validation.Match(fileExtensionRegex).Error("must contain only letters and numbers")),
	)
}

func (i UpdateReportInput) Validate() error {
	return validation.ValidateStruct(&i,
		validation.Field(&i.ReporterName, validation.NilOrNotEmpty, validation.Length(1, 255)),
		validation.Field(&i.Email, validation.NilOrNotEmpty, is.Email),
		validation.Field(&i.Description, validation.NilOrNotEmpty),
		validation.Field(&i.DataFile, validation.NilOrNotEmpty),
		validation.Field(&i.FileExtension, validation.NilOrNotEmpty, validation.Match(fileExtensionRegex).Error("must contain only letters and numbers")),
	)
}