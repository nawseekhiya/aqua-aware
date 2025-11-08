import fs from 'fs';
import path from 'path';
import { parse } from 'papaparse';
import supabase from '../lib/supabase';

// Map from the client component
const CITY_STATION_MAP: { [key: string]: string } = {
  'Bangalore': 'IND01116',
  'Chennai': 'IND01237',
  'Mumbai': 'IND00747',
  'Delhi': 'IND00257',
  'Kolkata': 'IND00210',
  'Hyderabad': 'IND01734',
  'Pune': 'IND00761',
  'Cochin': 'IND00828',
  'Varanasi': 'IND00917'
};

type CSVRow = Record<string, string>;

async function seed() {
  const csvPath = path.resolve(__dirname, '..', '..', 'data', 'water-quality.csv');
  const csv = fs.readFileSync(csvPath, 'utf8');

  const parsed = parse<CSVRow>(csv, {
    delimiter: ';',
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.replace(/\"/g, '').trim(),
    transform: (v: string) => v.replace(/\"/g, '').trim()
  });

  if (parsed.errors && parsed.errors.length > 0) {
    console.error('CSV parse errors:', parsed.errors);
  }

  const rows = parsed.data;

  // Batch insert into measurements
  const batchSize = 200;
  let batch: any[] = [];

  // Also prepare station->city mapping upsert
  const cityStationRows = Object.entries(CITY_STATION_MAP).map(([city, station_id]) => ({ city, station_id }));

  console.log(`Upserting ${cityStationRows.length} city_station_map rows...`);
  await supabase.from('city_station_map').upsert(cityStationRows, { onConflict: 'city' });

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const station_id = r['GEMS.Station.Number'];
    const sample_date = r['Sample.Date'] || null;
    const sample_time = r['Sample.Time'] || null;
    const depth = r['Depth'] ? Number(r['Depth']) : null;
    const parameter_code = r['Parameter.Code'] || null;
    const value = r['Value'] ? Number(r['Value']) : null;
    const unit = r['Unit'] || null;
    const data_quality = r['Data.Quality'] || null;

    batch.push({ station_id, sample_date, sample_time, depth, parameter_code, value, unit, data_quality });

    if (batch.length >= batchSize || i === rows.length - 1) {
      console.log(`Inserting batch of ${batch.length} measurements...`);
      const { error } = await supabase.from('measurements').insert(batch);
      if (error) {
        console.error('Insert error:', error);
        process.exit(1);
      }
      batch = [];
    }
  }

  console.log('Computing city summaries...');
  
  // Compute summaries based on same logic as client
  const cityMap = new Map<string, { city: string; quality: string; qualityScore: number; lastUpdated: string; mainPollutants: string[] }>();
  Object.keys(CITY_STATION_MAP).forEach(city => {
    cityMap.set(city, { city, quality: 'Excellent', qualityScore: 100, lastUpdated: '2000-01-01', mainPollutants: [] });
  });

  rows.forEach((row: any) => {
    const cityEntry = Object.entries(CITY_STATION_MAP).find(([_, station]) => station === row['GEMS.Station.Number']);
    if (!cityEntry) return;
    const [city] = cityEntry;
    const cityData = cityMap.get(city)!;
    const value = parseFloat(row.Value as unknown as string);
    const parameter = row['Parameter.Code'];
    const date = row['Sample.Date'];
    if (date && date > cityData.lastUpdated) cityData.lastUpdated = date;

    let scoreImpact = 0;
    const pollutants = new Set(cityData.mainPollutants);

    switch(parameter) {
      case 'pH':
        if (value < 6.5 || value > 8.5) { scoreImpact = 15; pollutants.add('pH imbalance'); }
        break;
      case 'Pb-Dis':
        if (value > 0.01) { scoreImpact = Math.min(value * 50, 80); pollutants.add('Lead contamination'); }
        break;
      case 'Cl-Dis':
        if (value > 5) { scoreImpact = value * 0.5; pollutants.add('High chlorine'); }
        break;
      case 'F-Dis':
        if (value < 0.5) { scoreImpact = 5; pollutants.add('Low fluoride'); }
        break;
      case 'TS':
        if (value > 50) { scoreImpact = value * 0.3; pollutants.add('High total solids'); }
        break;
      case 'H-T':
      case 'H-Ca':
        if (value > 150) { scoreImpact = (value - 150) * 0.2; pollutants.add('Water hardness'); }
        break;
    }

    cityData.qualityScore = Math.abs(cityData.qualityScore - scoreImpact);
    cityData.mainPollutants = Array.from(pollutants);
  });

  // Determine quality label and upsert summaries
  const summaries: any[] = [];
  cityMap.forEach(data => {
    let quality = 'Excellent';
    if (data.qualityScore >= 80) quality = 'Excellent';
    else if (data.qualityScore >= 60) quality = 'Good';
    else if (data.qualityScore >= 40) quality = 'Fair';
    else if (data.qualityScore >= 20) quality = 'Poor';
    else quality = 'Critical';

    summaries.push({ city: data.city, quality, quality_score: Math.round(data.qualityScore), last_updated: data.lastUpdated, main_pollutants: JSON.stringify(data.mainPollutants) });
  });

  console.log('Upserting city summaries...');
  for (const s of summaries) {
    const { error } = await supabase.from('city_summaries').upsert({ city: s.city, quality: s.quality, quality_score: s.quality_score, last_updated: s.last_updated, main_pollutants: s.main_pollutants }, { onConflict: 'city' });
    if (error) console.error('Upsert summary error', error);
  }

  console.log('Seeding completed successfully.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
