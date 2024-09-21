package article

import (
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/samdyra/go-geo/internal/utils/errors"
	"github.com/samdyra/go-geo/internal/utils/minio"
)

type ArticleService struct {
	db *sqlx.DB
}

func NewArticleService(db *sqlx.DB) *ArticleService {
	return &ArticleService{db: db}
}

func (s *ArticleService) GetArticles() ([]Article, error) {
	var articles []Article
	err := s.db.Select(&articles, "SELECT * FROM articles ORDER BY created_at DESC")
	if err != nil {
		return nil, errors.ErrInternalServer
	}
	return articles, nil
}

func (s *ArticleService) GetArticleByID(id int64) (*Article, error) {
	var article Article
	err := s.db.Get(&article, "SELECT * FROM articles WHERE id = $1", id)
	if err == sql.ErrNoRows {
		return nil, errors.ErrNotFound
	}
	if err != nil {
		return nil, errors.ErrInternalServer
	}
	return &article, nil
}

func (s *ArticleService) CreateArticle(input CreateArticleInput, userID int64) (*Article, error) {
    var username string
    err := s.db.Get(&username, "SELECT username FROM users WHERE id = $1", userID)
    if err != nil {
        log.Printf("Error fetching username: %v", err)
        return nil, errors.ErrInternalServer
    }

    var imageURL *string
    if input.ImageBase64 != "" {
        minioClient := minio.GetMinioClient()
        url, err := minioClient.UploadFile(input.ImageBase64, input.ImageExtension)
        if err != nil {
            log.Printf("Error uploading image to MinIO: %v", err)
            return nil, errors.ErrInternalServer
        }
        imageURL = &url
    }

    article := &Article{
        Title:     input.Title,
        Content:   input.Content,
        ImageURL:  imageURL,
        Author:    username,
        CreatedBy: userID,
        CreatedAt: time.Now(),
    }

    query := `INSERT INTO articles (title, content, image_url, author, created_by, created_at) 
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
    err = s.db.QueryRow(query, article.Title, article.Content, article.ImageURL, article.Author, article.CreatedBy, article.CreatedAt).
        Scan(&article.ID)
    if err != nil {
        log.Printf("Error creating article: %v", err)
        return nil, errors.ErrInternalServer
    }

    return article, nil
}

func (s *ArticleService) UpdateArticle(id int64, input UpdateArticleInput, userID int64) (*Article, error) {
	article, err := s.GetArticleByID(id)
	if err != nil {
		return nil, err
	}

	if article.CreatedBy != userID {
		return nil, errors.ErrUnauthorized
	}

	if input.Title != nil {
		article.Title = *input.Title
	}
	if input.Content != nil {
		article.Content = *input.Content
	}
	if input.ImageBase64 != nil && *input.ImageBase64 != "" {
		// Delete old image if exists
		if article.ImageURL != nil {
			minioClient := minio.GetMinioClient()
			oldObjectName := extractObjectNameFromURL(*article.ImageURL)
			err = minioClient.DeleteFile(oldObjectName)
			if err != nil {
				log.Printf("Error deleting old image from MinIO: %v", err)
				// Decide if you want to return here or continue
			}
		}

		// Upload new image
		minioClient := minio.GetMinioClient()
		newURL, err := minioClient.UploadFile(*input.ImageBase64, *input.ImageExtension)
		if err != nil {
			log.Printf("Error uploading new image to MinIO: %v", err)
			return nil, errors.ErrInternalServer
		}
		article.ImageURL = &newURL
	}

	query := `UPDATE articles SET title = $1, content = $2, image_url = $3 WHERE id = $4`
	_, err = s.db.Exec(query, article.Title, article.Content, article.ImageURL, id)
	if err != nil {
		return nil, errors.ErrInternalServer
	}

	return article, nil
}

func (s *ArticleService) DeleteArticle(id int64, userID int64) error {
	article, err := s.GetArticleByID(id)
	if err != nil {
		return err
	}

	if article.CreatedBy != userID {
		return errors.ErrUnauthorized
	}

	// Delete image from MinIO if exists
	if article.ImageURL != nil {
		minioClient := minio.GetMinioClient()
		objectName := extractObjectNameFromURL(*article.ImageURL)
		err = minioClient.DeleteFile(objectName)
		if err != nil {
			log.Printf("Error deleting image from MinIO: %v", err)
			// Decide if you want to return here or continue with article deletion
		}
	}

	_, err = s.db.Exec("DELETE FROM articles WHERE id = $1", id)
	if err != nil {
		return errors.ErrInternalServer
	}

	return nil
}

// Helper function to extract object name from URL
func extractObjectNameFromURL(url string) string {
	parts := strings.Split(url, "/")
	return parts[len(parts)-1]
}