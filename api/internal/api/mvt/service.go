package mvt

import (
	"fmt"
	"log"
	"math"

	"github.com/jmoiron/sqlx"
)

type MVTService struct {
	db *sqlx.DB
}

func NewMVTService(db *sqlx.DB) *MVTService {
	return &MVTService{db: db}
}

func tileBounds(z, x, y int) (minLon, minLat, maxLon, maxLat float64) {
	n := math.Pow(2, float64(z))
	minLon = float64(x)/n*360.0 - 180.0
	maxLon = float64(x+1)/n*360.0 - 180.0
	minLat = math.Atan(math.Sinh(math.Pi * (1 - 2*float64(y+1)/n)))
	maxLat = math.Atan(math.Sinh(math.Pi * (1 - 2*float64(y)/n)))
	minLat = minLat * 180.0 / math.Pi
	maxLat = maxLat * 180.0 / math.Pi
	return
}

// GenerateMVT generates Mapbox Vector Tiles for the given parameters.
func (s *MVTService) GenerateMVT(tableName string, z, x, y int) ([]byte, error) {
	// Calculate tile bounds
	minLon, minLat, maxLon, maxLat := tileBounds(z, x, y)

	query := fmt.Sprintf(`
		WITH
			tile AS (
				SELECT ST_MakeEnvelope($1, $2, $3, $4, 4326) AS geom
			),
			mvtgeom AS (
				SELECT
					ST_AsMVTGeom(
						ST_Transform(
							CASE
								WHEN $5 < 12 THEN ST_SimplifyPreserveTopology(%s.geom, ST_Perimeter(tile.geom)/4096)
								ELSE %s.geom
							END,
							3857
						),
						ST_Transform(tile.geom, 3857),
						4096,
						64,
						true
					) AS geom,
					kecamatan
				FROM %s, tile
				WHERE %s.geom && tile.geom
			)
		SELECT ST_AsMVT(mvtgeom.*, '%s', 4096, 'geom') AS mvt FROM mvtgeom;
	`, tableName, tableName, tableName, tableName, tableName)

	var mvt []byte
	err := s.db.QueryRow(query, minLon, minLat, maxLon, maxLat, z).Scan(&mvt)
	if err != nil {
		log.Printf("Error executing MVT query: %v", err)
		return nil, err
	}

	return mvt, nil
}
