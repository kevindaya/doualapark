--
-- PostgreSQL database dump
--

\restrict 6IjromF9xyNsuf808dyMGpitavplhEUJbdAXfLUMcPk8wzz8JdzH6kputPRARJI

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: statut_parking; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statut_parking AS ENUM (
    'libre',
    'quasi-plein',
    'complet'
);


ALTER TYPE public.statut_parking OWNER TO postgres;

--
-- Name: statut_reservation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statut_reservation AS ENUM (
    'en_cours',
    'terminee',
    'annulee'
);


ALTER TYPE public.statut_reservation OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avis (
    id_avis integer NOT NULL,
    note integer NOT NULL,
    commentaire text,
    date_avis date DEFAULT CURRENT_DATE NOT NULL,
    id_user integer NOT NULL,
    id_parking integer NOT NULL,
    CONSTRAINT avis_note_check CHECK (((note >= 1) AND (note <= 5)))
);


ALTER TABLE public.avis OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_id_avis_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_id_avis_seq OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avis_id_avis_seq OWNED BY public.avis.id_avis;


--
-- Name: parkings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parkings (
    id integer NOT NULL,
    nom character varying(150) NOT NULL,
    quartier character varying(100) NOT NULL,
    adresse character varying(255) NOT NULL,
    place_occupee integer DEFAULT 0 NOT NULL,
    place_total integer NOT NULL,
    note numeric(2,1) DEFAULT 0.0,
    distance numeric(5,2),
    prix integer NOT NULL,
    statut public.statut_parking DEFAULT 'libre'::public.statut_parking NOT NULL,
    couleur character varying(20),
    image text,
    lat numeric(10,7),
    lng numeric(10,7)
);


ALTER TABLE public.parkings OWNER TO postgres;

--
-- Name: parkings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parkings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parkings_id_seq OWNER TO postgres;

--
-- Name: parkings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parkings_id_seq OWNED BY public.parkings.id;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id_reservation integer NOT NULL,
    heure_debut time without time zone NOT NULL,
    heure_fin time without time zone NOT NULL,
    prix_reservation integer NOT NULL,
    date_reservation date DEFAULT CURRENT_DATE NOT NULL,
    statut public.statut_reservation DEFAULT 'en_cours'::public.statut_reservation NOT NULL,
    code_qr character varying(50) NOT NULL,
    id_user integer NOT NULL,
    id_parking integer NOT NULL
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_reservation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_reservation_seq OWNER TO postgres;

--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_reservation_seq OWNED BY public.reservations.id_reservation;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id_user integer NOT NULL,
    nom character varying(150) NOT NULL,
    numero_plaque character varying(20) NOT NULL
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: utilisateurs_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_user_seq OWNER TO postgres;

--
-- Name: utilisateurs_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_id_user_seq OWNED BY public.utilisateurs.id_user;


--
-- Name: avis id_avis; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis ALTER COLUMN id_avis SET DEFAULT nextval('public.avis_id_avis_seq'::regclass);


--
-- Name: parkings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parkings ALTER COLUMN id SET DEFAULT nextval('public.parkings_id_seq'::regclass);


--
-- Name: reservations id_reservation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id_reservation SET DEFAULT nextval('public.reservations_id_reservation_seq'::regclass);


--
-- Name: utilisateurs id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id_user SET DEFAULT nextval('public.utilisateurs_id_user_seq'::regclass);


--
-- Data for Name: avis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avis (id_avis, note, commentaire, date_avis, id_user, id_parking) FROM stdin;
\.


--
-- Data for Name: parkings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parkings (id, nom, quartier, adresse, place_occupee, place_total, note, distance, prix, statut, couleur, image, lat, lng) FROM stdin;
8	IUT de Douala Cellule Informatique	IUT de Douala	NDOGBONG	1	3	5.0	15	1000	libre	#3B82F6		4.0560289	9.7455545
7	IUT de Douala Scolarite	IUT de Douala	NDOGBONG	2	4	5.0	15	1000	quasi-plein	#F97316		4.0559624	9.7455732
6	IUT de Douala AUF	IUT de Douala	NDOGBONG	4	8	4.0	20	1000	libre	#3B82F6		4.0564605	9.744962
5	Bonapriso Résidentiel	Bonapriso	Rue de Triomphe, Bonapriso	30	45	4.8	4.20	600	libre	#3B82F6	https://images.unsplash.com/photo-1611288875785-5e7add96d082?w=600&q=80	4.0200000	9.6950000
4	Deido Marché Central	Deido	Av. Gén. de Gaulle, Deido	38	60	4.3	2.10	300	libre	#10B981	https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=600&q=80	4.0580000	9.7100000
3	Douala Grand Mall	Bali	Rue Manguiers, Bali	150	150	4.7	3.80	1000	complet	#EF4444	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80	4.0650000	9.7350000
2	Bonanjo Finance District	Bonanjo	Rue Joss, Bonanjo	72	80	4.0	1.90	400	quasi-plein	#F97316	https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80	4.0500000	9.6870000
1	Akwa Central Plaza	Akwa	Bd de la Liberté, Akwa	85	120	4.5	0.80	500	libre	#10B981	https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600&q=80	4.0435000	9.6966000
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id_reservation, heure_debut, heure_fin, prix_reservation, date_reservation, statut, code_qr, id_user, id_parking) FROM stdin;
1	08:00:00	10:00:00	1000	2026-05-31	annulee	DP-9487	4	1
2	08:00:00	10:00:00	1000	2026-05-31	annulee	DP-3730	5	1
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id_user, nom, numero_plaque) FROM stdin;
1	Jean-Baptiste Mbarga	LT 456 BB
2	Christelle Ewodo	CE 789 CD
3	jean mbarga	LT456BB
4	jean mbarga	LT 458 GG
5	alice kamdem	LT 222DD
\.


--
-- Name: avis_id_avis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avis_id_avis_seq', 1, false);


--
-- Name: parkings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parkings_id_seq', 5, true);


--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_reservation_seq', 2, true);


--
-- Name: utilisateurs_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_user_seq', 5, true);


--
-- Name: avis avis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_pkey PRIMARY KEY (id_avis);


--
-- Name: parkings parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parkings
    ADD CONSTRAINT parkings_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_code_qr_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_code_qr_key UNIQUE (code_qr);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id_reservation);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id_user);


--
-- Name: idx_parkings_quartier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parkings_quartier ON public.parkings USING btree (quartier);


--
-- Name: idx_parkings_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parkings_statut ON public.parkings USING btree (statut);


--
-- Name: idx_reservations_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_date ON public.reservations USING btree (date_reservation);


--
-- Name: idx_reservations_parking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_parking ON public.reservations USING btree (id_parking);


--
-- Name: idx_reservations_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_statut ON public.reservations USING btree (statut);


--
-- Name: idx_reservations_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user ON public.reservations USING btree (id_user);


--
-- Name: idx_utilisateurs_plaque; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateurs_plaque ON public.utilisateurs USING btree (numero_plaque);


--
-- Name: avis avis_id_parking_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_id_parking_fkey FOREIGN KEY (id_parking) REFERENCES public.parkings(id) ON DELETE CASCADE;


--
-- Name: avis avis_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.utilisateurs(id_user) ON DELETE CASCADE;


--
-- Name: reservations reservations_id_parking_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_id_parking_fkey FOREIGN KEY (id_parking) REFERENCES public.parkings(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.utilisateurs(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6IjromF9xyNsuf808dyMGpitavplhEUJbdAXfLUMcPk8wzz8JdzH6kputPRARJI

