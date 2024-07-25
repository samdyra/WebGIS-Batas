-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS titik_bekasi_id_seq;

-- Table Definition
CREATE TABLE "public"."titik_bekasi" (
    "id" int4 NOT NULL DEFAULT nextval('titik_bekasi_id_seq'::regclass),
    "geom" geometry(Point,4326),
    "objectid" numeric,
    "namobj" varchar(250),
    "fcode" varchar(50),
    "remark" varchar(250),
    "metadata" varchar(50),
    "srs_id" varchar(50),
    "tpba" varchar(50),
    "klsplr" int8,
    "lpdaprov" varchar(50),
    "lpdakkot" varchar(50),
    "lpdakec" varchar(50),
    "lpakdes" varchar(50),
    "metukr" int8,
    "stkdat" varchar(50),
    "thnbuat" varchar(24),
    "thnpgshn" varchar(24),
    "monumn" int8,
    "tiphpt" int8,
    "tipadm" int8,
    "akurav" int8,
    "koordy" numeric,
    "koordx" numeric,
    "lokasi" varchar(50),
    "elevas" numeric,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS garis_bekasi_id_seq;

-- Table Definition
CREATE TABLE "public"."garis_bekasi" (
    "id" int4 NOT NULL DEFAULT nextval('garis_bekasi_id_seq'::regclass),
    "geom" geometry(MultiLineStringZ,4326),
    "objectid_1" numeric,
    "namobj" varchar(250),
    "fcode" varchar(50),
    "remark" varchar(250),
    "metadata" varchar(50),
    "srs_id" varchar(50),
    "admin1" varchar(50),
    "admin2" varchar(50),
    "karktr" int8,
    "klbadm" int8,
    "pjgbts" numeric,
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
    "shape_leng" numeric,
    PRIMARY KEY ("id")
);