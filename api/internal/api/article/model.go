package article

import (
	"regexp"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

type Article struct {
	ID        int64     `db:"id" json:"id"`
	Title     string    `db:"title" json:"title"`
	Content   string    `db:"content" json:"content"`
	ImageURL  *string   `db:"image_url" json:"image_url,omitempty"`
	Author    string    `db:"author" json:"author"`
	CreatedBy int64     `db:"created_by" json:"created_by"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type CreateArticleInput struct {
	Title          string `json:"title"`
	Content        string `json:"content"`
	ImageBase64    string `json:"image_base64"`
	ImageExtension string `json:"image_extension"`
}

type UpdateArticleInput struct {
	Title          *string `json:"title,omitempty"`
	Content        *string `json:"content,omitempty"`
	ImageBase64    *string `json:"image_base64,omitempty"`
	ImageExtension *string `json:"image_extension,omitempty"`
}

func (i CreateArticleInput) Validate() error {
	return validation.ValidateStruct(&i,
		validation.Field(&i.Title, validation.Required, validation.Length(1, 255)),
		validation.Field(&i.Content, validation.Required),
		validation.Field(&i.ImageBase64, is.Base64),
		validation.Field(&i.ImageExtension, validation.Required.When(i.ImageBase64 != ""), validation.Match(fileExtensionRegex).Error("must contain only letters and numbers")),
	)
}

func (i UpdateArticleInput) Validate() error {
	return validation.ValidateStruct(&i,
		validation.Field(&i.Title, validation.NilOrNotEmpty, validation.Length(1, 255)),
		validation.Field(&i.Content, validation.NilOrNotEmpty),
		validation.Field(&i.ImageBase64, validation.NilOrNotEmpty, is.Base64),
		validation.Field(&i.ImageExtension, validation.Required.When(i.ImageBase64 != nil && *i.ImageBase64 != ""), validation.Match(fileExtensionRegex).Error("must contain only letters and numbers")),
	)
}

var fileExtensionRegex = regexp.MustCompile(`^[a-zA-Z0-9]+$`)