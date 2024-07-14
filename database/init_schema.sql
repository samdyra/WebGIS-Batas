-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS shp_batas_wgs_pk_seq;

-- Table Definition
CREATE TABLE "public"."shp_batas_wgs" (
    "pk" int4 NOT NULL DEFAULT nextval('shp_batas_wgs_pk_seq'::regclass),
    "geom" geometry(MultiLineString,4326),
    "objectid" int8,
    "namobj" varchar(250),
    "fcode" varchar(50),
    "remark" varchar(250),
    "metadata" varchar(50),
    "srs_id" varchar(50),
    "admin1" varchar(50),
    "admin2" varchar(50),
    "karktr" int8,
    "klbadm" int8,
    "pjgbts" float8,
    "stsbts" int8,
    "tiplok" int8,
    "tiptbt" int8,
    "uupp" varchar(50),
    "wadkc1" varchar(50),
    "wadkc2" varchar(50),
    "wakbk1" varchar(50),
    "wakbk2" varchar(50),
    "wakld1" varchar(50),
    "wakld2" varchar(50),
    "wapro1" varchar(50),
    "wapro2" varchar(50),
    "ruleid" int8,
    "shape_leng" float8,
    PRIMARY KEY ("pk")
);



-- Table Definition
CREATE TABLE "public"."batas_titik" (
    "id" int8 NOT NULL,
    "geom" geometry(MultiPoint,4326),
    "name" varchar(80),
    "desc" varchar(80),
    PRIMARY KEY ("id")
);

