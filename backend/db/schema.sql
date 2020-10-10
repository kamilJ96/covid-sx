--
-- PostgreSQL database dump
--

-- Dumped from database version 11.7 (Debian 11.7-0+deb10u1)
-- Dumped by pg_dump version 11.7 (Debian 11.7-0+deb10u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: asx_d1; Type: TABLE; Schema: public; Owner: kam
--

CREATE TABLE public.asx_d1 (
    id integer NOT NULL,
    symbol text NOT NULL,
    date timestamp with time zone NOT NULL,
    price numeric NOT NULL,
    volume integer NOT NULL
);


ALTER TABLE public.asx_d1 OWNER TO kam;

--
-- Name: asx_d1_id_seq; Type: SEQUENCE; Schema: public; Owner: kam
--

CREATE SEQUENCE public.asx_d1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asx_d1_id_seq OWNER TO kam;

--
-- Name: asx_d1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kam
--

ALTER SEQUENCE public.asx_d1_id_seq OWNED BY public.asx_d1.id;


--
-- Name: symbols; Type: TABLE; Schema: public; Owner: kam
--

CREATE TABLE public.symbols (
    code text NOT NULL,
    company text NOT NULL,
    sector text NOT NULL,
    market_cap bigint,
    country text DEFAULT ''::text,
    state text DEFAULT ''::text,
    industry text DEFAULT ''::text
);


ALTER TABLE public.symbols OWNER TO kam;

--
-- Name: asx_d1 id; Type: DEFAULT; Schema: public; Owner: kam
--

ALTER TABLE ONLY public.asx_d1 ALTER COLUMN id SET DEFAULT nextval('public.asx_d1_id_seq'::regclass);


--
-- Name: asx_d1 asx_d1_pkey; Type: CONSTRAINT; Schema: public; Owner: kam
--

ALTER TABLE ONLY public.asx_d1
    ADD CONSTRAINT asx_d1_pkey PRIMARY KEY (id);


--
-- Name: asx_d1 asx_d1_symbol_date_key; Type: CONSTRAINT; Schema: public; Owner: kam
--

ALTER TABLE ONLY public.asx_d1
    ADD CONSTRAINT asx_d1_symbol_date_key UNIQUE (symbol, date);


--
-- Name: symbols symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: kam
--

ALTER TABLE ONLY public.symbols
    ADD CONSTRAINT symbols_pkey PRIMARY KEY (code);


--
-- Name: asx_d1_symbol_idx; Type: INDEX; Schema: public; Owner: kam
--

CREATE INDEX asx_d1_symbol_idx ON public.asx_d1 USING btree (symbol);


--
-- Data for Name: symbols; Type: TABLE DATA; Schema: public; Owner: kam
--

COPY public.symbols (code, company, sector, market_cap, country, state, industry) FROM stdin;
ABC	Adbri Ltd	Materials	1930710000	Australia	SA	Building Materials
APT	Afterpay Ltd	Information Technology	12767000000	Australia	VIC	Software—Infrastructure
ALQ	Als Ltd	Industrials	3401100000	Australia	QLD	Consulting Services
AMC	Amcor Plc	Materials	14532200000	Switzerland		Packaging & Containers
AMP	AMP Ltd	Financials	5756300000	Australia	NSW	Asset Management
APE	AP Eagers Ltd	Consumer Discretionary	1677770000	Australia	QLD	Auto & Truck Dealerships
APX	Appen Ltd	Information Technology	3750440000	Australia	NSW	Information Technology Services
ALL	Aristocrat Leisure Ltd	Consumer Discretionary	16908600000	Australia	NSW	Electronic Gaming & Multimedia
ASX	ASX Ltd	Financials	17015100000	Australia	NSW	Financial Data & Stock Exchanges
AZJ	Aurizon Holdings Ltd	Industrials	9180470000	Australia	QLD	Railroads
ASB	Austal Ltd	Industrials	1301370000	Australia	WA	Aerospace & Defense
BOQ	Bank of Queensland Ltd	Financials	2380720000	Australia	QLD	Banks—Regional
BAP	Bapcor Ltd	Consumer Discretionary	1999140000	Australia	VIC	Specialty Retail
BPT	Beach Energy Ltd	Energy	3808950000	Australia	SA	Oil & Gas E&P
BEN	Bendigo and Adelaide Bank Ltd	Financials	3291010000	Australia	VIC	Banks—Regional
BIN	Bingo Industries Ltd	Industrials	1654140000	Australia	NSW	Waste Management
BKL	Blackmores Ltd	Consumer Staples	1444250000	Australia	NSW	Household & Personal Products
BLD	Boral Ltd	Materials	4069170000	Australia	NSW	Building Materials
BVS	Bravura Solutions Ltd	Information Technology	1194840000	Australia	NSW	Software—Application
BKW	Brickworks Ltd	Materials	2343520000	Australia	NSW	Building Materials
BWP	BWP Trust	Real Estate	2370400000	Australia	WA	REIT—Industrial
CGF	Challenger Ltd	Financials	3024760000	Australia	NSW	Insurance—Life
CHC	Charter Hall Group	Real Estate	4541330000	Australia	NSW	REIT—Diversified
CLW	Charter Hall Long Wale REIT	Real Estate	2078720000	Australia	NSW	REIT—Diversified
CNU	Chorus Ltd	Telecommunication Services	3107000000	New Zealand		Telecom Services
CIM	Cimic Group Ltd	Industrials	8169790000	Australia	NSW	Engineering & Construction
CUV	Clinuvel Pharmaceuticals Ltd	Health Care	1148790000	Australia	VIC	Biotechnology
COH	Cochlear Ltd	Health Care	12744000000	Australia	NSW	Medical Devices
COL	Coles Group Ltd	Consumer Staples	20649200000	Australia	VIC	Grocery Stores
CKF	Collins Foods Ltd	Consumer Discretionary	927987000	Australia	QLD	Restaurants
CPU	Computershare Ltd	Information Technology	7177470000	Australia	VIC	Information Technology Services
COE	Cooper Energy Ltd	Energy	683192000	Australia	SA	Oil & Gas E&P
CGC	Costa Group Holdings Ltd	Consumer Staples	1282660000	Australia	VIC	Farm Products
CCP	Credit Corp Group Ltd	Financials	1065190000	Australia	NSW	Credit Services
CMW	Cromwell Property Group	Real Estate	2129490000	Australia	QLD	REIT—Office
CSL	CSL Ltd	Health Care	129254000000	Australia	VIC	Biotechnology
CSR	CSR Ltd	Materials	2043460000	Australia	NSW	Building Materials
DMP	Domino's PIZZA Enterprises Ltd	Consumer Discretionary	5357120000	Australia	QLD	Restaurants
DOW	Downer Edi Ltd	Industrials	2670210000	Australia	NSW	Engineering & Construction
ELD	Elders Ltd	Consumer Staples	1534940000	Australia	SA	Farm Products
EHE	Estia Health Ltd	Health Care	390602000	Australia	NSW	Medical Care Facilities
EVN	Evolution Mining Ltd	Materials	10737800000	Australia	NSW	Gold
FBU	Fletcher Building Ltd	Materials	2926110000	New Zealand		Building Materials
FLT	Flight Centre Travel Group Ltd	Consumer Discretionary	2715050000	Australia	QLD	Travel Services
FMG	Fortescue Metals Group Ltd	Materials	45537900000	Australia	WA	Other Industrial Metals & Mining
GEM	G8 Education Ltd	Consumer Discretionary	861797000	Australia	QLD	Education & Training Services
GOR	Gold Road Resources Ltd	Materials	1636270000	Australia	WA	Gold
GPT	GPT Group	Real Estate	7791720000	Australia	NSW	REIT—Diversified
GOZ	Growthpoint Properties Australia	Real Estate	2477410000	Australia	VIC	REIT—Diversified
GWA	GWA Group Ltd	Industrials	818238000	Australia	QLD	Furnishings Fixtures & Appliances
HLS	Healius Ltd	Health Care	1538170000	Australia	NSW	Medical Care Facilities
HUB	HUB24 Ltd	Financials	651086000	Australia	NSW	Capital Markets
IGO	IGO Ltd	Materials	3060330000	Australia	WA	Other Industrial Metals & Mining
IPL	Incitec Pivot Ltd	Materials	3807750000	Australia	VIC	Specialty Chemicals
INA	Ingenia Communities Group	Real Estate	1368240000	Australia	NSW	REIT—Residential
IAG	Insurance Australia Group Ltd	Financials	13935600000	Australia	NSW	Insurance—Property & Casualty
IVC	Invocare Ltd	Consumer Discretionary	1634850000	Australia	NSW	Personal Services
IPH	IPH Ltd	Industrials	1629410000	Australia	NSW	Consulting Services
JHX	James Hardie Industries Plc	Materials	11690200000	Ireland		Building Materials
JHG	Janus Henderson Group Plc	Financials	1234170000	United Kingdom		Asset Management
JIN	Jumbo Interactive Ltd	Consumer Discretionary	740970000	Australia	QLD	Gambling
LLC	Lendlease Group	Real Estate	8688540000	Australia	NSW	Real Estate—Diversified
LNK	Link Administration Holdings Ltd	Information Technology	2163740000	Australia	NSW	Information Technology Services
LYC	Lynas Corporation Ltd	Materials	1464490000	Malaysia		Other Industrial Metals & Mining
MGR	Mirvac Group	Real Estate	9048070000	Australia	NSW	REIT—Office
ALU	Altium Ltd	Information Technology	4886330000	United States		Software—Application
ABP	Abacus Property Group	Real Estate	1679500000	Australia	NSW	REIT—Diversified
AGL	AGL Energy Ltd	Utilities	10537700000	Australia	NSW	Utilities—Renewable
AWC	Alumina Ltd	Materials	4362960000	Australia	VIC	Aluminum
ANN	Ansell Ltd	Health Care	4596140000	Australia	VIC	Medical Instruments & Supplies
APA	APA Group	Utilities	13592400000	Australia	NSW	Utilities—Regulated Gas
ARB	ARB Corporation Ltd	Consumer Discretionary	1378670000	Australia	VIC	Auto Parts
ALX	Atlas Arteria	Industrials	5802580000	Australia	VIC	Infrastructure Operations
MND	Monadelphous Group Ltd	Industrials	1123480000	Australia	WA	Engineering & Construction
MPL	Medibank Private Ltd	Financials	7766290000	Australia	VIC	Insurance—Diversified
MTS	Metcash Ltd	Consumer Staples	2750160000	Australia	NSW	Food Distribution
NAB	National Australia Bank Ltd	Financials	57372200000	Australia	VIC	Banks—Diversified
NAN	Nanosonics Ltd	Health Care	2164350000	Australia	NSW	Medical Instruments & Supplies
NEA	Nearmap Ltd	Information Technology	991448000	Australia	NSW	Internet Content & Information
NHC	New Hope Corporation Ltd	Energy	1139440000	Australia	QLD	Thermal Coal
NHF	Nib Holdings Ltd	Financials	2096800000	Australia	NSW	Insurance—Specialty
NSR	National Storage REIT	Real Estate	1808630000	Australia	QLD	REIT—Industrial
NUF	Nufarm Ltd	Materials	2122490000	Australia	VIC	Agricultural Inputs
NWH	NRW Holdings Ltd	Industrials	829903000	Australia	WA	Engineering & Construction
OML	Ooh!Media Ltd	Communication Services	645049000	Australia	NSW	Advertising Agencies
ORA	Orora Ltd	Materials	3233920000	Australia	VIC	Packaging & Containers
ORG	Origin Energy Ltd	Energy	10708200000	Australia	NSW	Oil & Gas Integrated
ORI	Orica Ltd	Materials	7041830000	Australia	VIC	Specialty Chemicals
OZL	OZ Minerals Ltd	Materials	3121930000	Australia	SA	Copper
PDL	Pendal Group Ltd	Financials	2014290000	Australia	NSW	Asset Management
PME	Pro Medicus Ltd	Health Care	3047720000	Australia	VIC	Health Information Services
PNI	Pinnacle Investment Management Group Ltd	Financials	781508000	Australia	NSW	Asset Management
PNV	Polynovo Ltd	Health Care	1778330000	Australia	VIC	Biotechnology
PPT	Perpetual Ltd	Financials	1449620000	Australia	NSW	Asset Management
PTM	Platinum Asset Management Ltd	Financials	2211780000	Australia	NSW	Asset Management
QAN	Qantas Airways Ltd	Industrials	5978080000	Australia	NSW	Airlines
QUB	QUBE Holdings Ltd	Industrials	5160840000	Australia	NSW	Integrated Freight & Logistics
RHC	Ramsay Health Care Ltd	Health Care	15941600000	Australia	NSW	Medical Care Facilities
RIO	RIO Tinto Ltd	Materials	36093400000	United Kingdom		Other Industrial Metals & Mining
RRL	Regis Resources Ltd	Materials	2779750000	Australia	WA	Gold
RSG	Resolute Mining Ltd	Materials	1295820000	Australia	WA	Gold
S32	SOUTH32 Ltd	Materials	9450220000	Australia	WA	Other Industrial Metals & Mining
SAR	Saracen Mineral Holdings Ltd	Materials	5768120000	Australia	WA	Gold
SBM	ST Barbara Ltd	Materials	2285060000	Australia	VIC	Gold
SCP	Shopping Centres Australasia Property Group	Real Estate	2410690000	Australia	NSW	REIT—Retail
SEK	Seek Ltd	Communication Services	7129440000	Australia	VIC	Staffing & Employment Services
SFR	Sandfire Resources Ltd	Materials	811044000	Australia	WA	Copper
SGM	Sims Ltd	Materials	1572670000	Australia	NSW	Steel
SHL	Sonic Healthcare Ltd	Health Care	13390600000	Australia	NSW	Medical Care Facilities
SIQ	Smartgroup Corporation Ltd	Industrials	876779000	Australia	NSW	Specialty Business Services
SKI	Spark Infrastructure Group	Utilities	3598390000	Australia	NSW	Utilities—Regulated Electric
SLR	Silver Lake Resources Ltd	Materials	1988450000	Australia	WA	Gold
SOL	Washington H Soul Pattinson & Company Ltd	Energy	4637090000	Australia	NSW	Thermal Coal
SSM	Service Stream Ltd	Industrials	824213000	Australia	VIC	Engineering & Construction
STO	Santos Ltd	Energy	11456900000	Australia	SA	Oil & Gas E&P
SUN	Suncorp Group Ltd	Financials	11588100000	Australia	QLD	Insurance—Property & Casualty
SVW	Seven Group Holdings Ltd	Industrials	5633340000	Australia	NSW	Conglomerates
SYD	Sydney Airport	Industrials	13333000000	Australia	NSW	Airports & Air Services
TAH	Tabcorp Holdings Ltd	Consumer Discretionary	6605010000	Australia	VIC	Gambling
TCL	Transurban Group	Industrials	39358100000	Australia	VIC	Infrastructure Operations
TLS	Telstra Corporation Ltd	Telecommunication Services	38296400000	Australia	VIC	Telecom Services
TNE	Technology One Ltd	Information Technology	2919020000	Australia	QLD	Software—Application
UMG	United Malt Group Ltd	Consumer Staples	1295510000	Australia	NSW	Beverages—Brewers
URW	Unibail-Rodamco-Westfield	Real Estate	1012960000	France		REIT—Retail
VEA	Viva Energy Group Ltd	Energy	3130700000	Australia	VIC	Oil & Gas Refining & Marketing
VUK	Virgin Money Uk Plc	Financials	1624130000	United Kingdom		Banks—Regional
WBC	Westpac Banking Corporation	Financials	62698800000	Australia	NSW	Banks—Diversified
WES	Wesfarmers Ltd	Consumer Discretionary	46101900000	Australia	WA	Home Improvement Retail
WHC	Whitehaven Coal Ltd	Energy	1816100000	Australia	NSW	Thermal Coal
WOW	Woolworths Group Ltd	Consumer Staples	44561800000	Australia	NSW	Grocery Stores
WPL	Woodside Petroleum Ltd	Energy	21883400000	Australia	WA	Oil & Gas E&P
WTC	Wisetech Global Ltd	Information Technology	6520550000	Australia	NSW	Software—Application
TPG	TPG Telecom Ltd	Telecommunication Services	7663720000	Australia	NSW	Telecom Services
NWS	News Corporation	Communication Services	885415000	United States		Broadcasting
AST	Ausnet Services Ltd	Utilities	6521970000	Australia	VIC	Utilities—Diversified
ANZ	Australia and New Zealand Banking Group Ltd	Financials	51193000000	Australia	VIC	Banks—Diversified
BGA	Bega Cheese Ltd	Consumer Staples	1140810000	Australia	NSW	Packaged Foods
BHP	BHP Group Ltd	Materials	105196000000	Australia	VIC	Other Industrial Metals & Mining
BSL	Bluescope Steel Ltd	Materials	5639540000	Australia	VIC	Steel
BXB	Brambles Ltd	Industrials	17635900000	Australia	NSW	Specialty Business Services
BRG	Breville Group Ltd	Consumer Discretionary	3076680000	Australia	NSW	Furnishings Fixtures & Appliances
CAR	Carsales.com Ltd	Communication Services	3995770000	Australia	VIC	Internet Content & Information
CQR	Charter Hall Retail REIT	Real Estate	1844150000	Australia	NSW	REIT—Retail
CWY	Cleanaway Waste Management Ltd	Industrials	4087350000	Australia	VIC	Waste Management
CCL	Coca-Cola Amatil Ltd	Consumer Staples	6298800000	Australia	NSW	Beverages—Non-Alcoholic
CBA	Commonwealth Bank of Australia	Financials	113118000000	Australia	NSW	Banks—Diversified
CTD	Corporate Travel Management Ltd	Consumer Discretionary	1320000000	Australia	QLD	Travel Services
CWN	Crown Resorts Ltd	Consumer Discretionary	6541350000	Australia	VIC	Resorts & Casinos
DXS	Dexus	Real Estate	10017200000	Australia	NSW	REIT—Diversified
DHG	Domain Holdings Australia Ltd	Communication Services	1764480000	Australia	NSW	Internet Content & Information
EML	EML Payments Ltd	Information Technology	1338090000	Australia	QLD	Information Technology Services
FPH	Fisher & Paykel Healthcare Corporation Ltd	Health Care	15882800000	New Zealand		Medical Instruments & Supplies
GUD	G.U.D. Holdings Ltd	Consumer Discretionary	922500000	Australia	VIC	Specialty Industrial Machinery
GMG	Goodman Group	Real Estate	28139300000	Australia	NSW	REIT—Diversified
GNC	Graincorp Ltd	Consumer Staples	1009250000	Australia	NSW	Farm Products
HVN	Harvey Norman Holdings Ltd	Consumer Discretionary	4186580000	Australia	NSW	Department Stores
IEL	Idp Education Ltd	Consumer Discretionary	4776250000	Australia	VIC	Education & Training Services
ILU	Iluka Resources Ltd	Materials	3606230000	Australia	WA	Other Industrial Metals & Mining
ING	Inghams Group Ltd	Consumer Staples	1233980000	Australia	NSW	Farm Products
IFL	IOOF Holdings Ltd	Financials	1688680000	Australia	VIC	Asset Management
IRE	Iress Ltd	Information Technology	1978000000	Australia	VIC	Software—Application
JBH	JB Hi-Fi Ltd	Consumer Discretionary	4360970000	Australia	VIC	Specialty Retail
A2M	The a2 Milk Company Ltd	Consumer Staples	12806500000	New Zealand		Farm Products
MFG	Magellan Financial Group Ltd	Financials	10668900000	Australia	NSW	Asset Management
MIN	Mineral Resources Ltd	Materials	3656310000	Australia	WA	Other Industrial Metals & Mining
MMS	Mcmillan Shakespeare Ltd	Industrials	684049000	Australia	VIC	Staffing & Employment Services
MQG	Macquarie Group Ltd	Financials	39155600000	Australia	NSW	Capital Markets
MYX	Mayne Pharma Group Ltd	Health Care	713604000	Australia	SA	Drug Manufacturers—General
NCM	Newcrest Mining Ltd	Materials	25395500000	Australia	VIC	Gold
NEC	Nine Entertainment Co. Holdings Ltd	Communication Services	2558090000	Australia	NSW	Broadcasting
NST	Northern Star Resources Ltd	Materials	11226500000	Australia	WA	Gold
NWL	Netwealth Group Ltd	Financials	1946720000	Australia	VIC	Capital Markets
NXT	NEXTDC Ltd	Information Technology	4090870000	Australia	QLD	Information Technology Services
ORE	Orocobre Ltd	Materials	681647000	Australia	QLD	Other Industrial Metals & Mining
OSH	Oil Search Ltd	Energy	7376370000	Papua New Guinea		Oil & Gas E&P
PLS	Pilbara Minerals Ltd	Materials	589282000	Australia	WA	Other Industrial Metals & Mining
PMV	Premier Investments Ltd	Consumer Discretionary	2603080000	Australia	VIC	Apparel Retail
PRN	Perenti Global Ltd	Materials	866264000	Australia	WA	Other Industrial Metals & Mining
QBE	QBE Insurance Group Ltd	Financials	12840900000	Australia	NSW	Insurance—Property & Casualty
REA	REA Group Ltd	Communication Services	13540300000	Australia	VIC	Internet Content & Information
SCG	Scentre Group	Real Estate	11366900000	Australia	NSW	REIT—Retail
SDF	Steadfast Group Ltd	Financials	2883110000	Australia	NSW	Insurance Brokers
SGP	Stockland	Real Estate	8416760000	Australia	NSW	REIT—Diversified
SGR	The Star Entertainment Group Ltd	Consumer Discretionary	2788660000	Australia	QLD	Resorts & Casinos
SKC	Skycity Entertainment Group Ltd	Consumer Discretionary	1607940000	New Zealand		Resorts & Casinos
SPK	Spark New Zealand Ltd	Telecommunication Services	7458400000	New Zealand		Telecom Services
SUL	Super Retail Group Ltd	Consumer Discretionary	1687030000	Australia	QLD	Specialty Retail
SXL	Southern Cross Media Group Ltd	Communication Services	594474000	Australia	VIC	Entertainment
TGR	Tassal Group Ltd	Consumer Staples	817654000	Australia	TAS	Farm Products
TWE	Treasury Wine Estates Ltd	Consumer Staples	7035010000	Australia	VIC	Beverages—Wineries & Distilleries
VCX	Vicinity Centres	Real Estate	5987320000	Australia	VIC	REIT—Retail
VOC	Vocus Group Ltd	Telecommunication Services	1867920000	Australia	VIC	Telecom Services
WEB	Webjet Ltd	Consumer Discretionary	1457710000	Australia	VIC	Travel Services
WOR	Worley Ltd	Energy	4475320000	Australia	NSW	Oil & Gas Equipment & Services
WSA	Western Areas Ltd	Materials	635699000	Australia	WA	Other Industrial Metals & Mining
XRO	Xero Ltd	Information Technology	12294400000	New Zealand		Software—Application
AVH	Avita Medical Ltd	Health Care	1045380000	United States		Medical Devices
RMD	Resmed Inc	Health Care	8585750000	United States		Medical Instruments & Supplies
RWC	Reliance Worldwide Corporation Ltd	Industrials	2417690000	United States		Building Products & Equipment
\.

--
-- PostgreSQL database dump complete
--
