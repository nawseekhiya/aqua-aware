-- Migration: create tables for water quality ingestion
-- Run this in Supabase SQL editor or via psql

-- Optional: ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

-- measurements: raw CSV rows
create table if not exists public.measurements (
  id uuid default gen_random_uuid() primary key,
  station_id text not null,
  sample_date date,
  sample_time text,
  depth numeric,
  parameter_code text,
  value numeric,
  unit text,
  data_quality text,
  created_at timestamptz default now()
);

create index if not exists idx_measurements_station on public.measurements(station_id);
create index if not exists idx_measurements_date on public.measurements(sample_date);

-- city_station_map: map city -> station id (seedable)
create table if not exists public.city_station_map (
  city text primary key,
  station_id text not null
);

-- city_summaries: materialized summary per city
create table if not exists public.city_summaries (
  city text primary key,
  quality text,
  quality_score integer,
  last_updated date,
  main_pollutants jsonb,
  updated_at timestamptz default now()
);
