Cara seed data dari SHP --> data di postgis container

1. buka qgis, dan buka shpnya
2. run container postgis/postgis
3. konekin qgis ke database. tutorial: https://www.youtube.com/watch?v=D2Z2udAKNeY
4. import data shp ke table di db.
5. buka table hasil shp di tableplus
6. copas ke init_schema.sql (schema) dan seed_data.sql (default data)