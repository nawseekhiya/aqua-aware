import * as express from 'express';
import supabase from '../lib/supabase';

const router = express.Router();

// GET /water-quality
// Returns a list of city summaries. Each summary includes city, quality label, a numeric score,
// lastUpdated timestamp and mainPollutants (parsed as an array/object when necessary).
const getSummaries: express.RequestHandler = async (req, res) => {
	try {
		// Read all city summaries from the materialized table `city_summaries`.
		const { data, error } = await supabase.from('city_summaries').select('*');
		if (error) {
			// Bubble up DB errors to the client as 500 — the caller can retry later.
			res.status(500).json({ error: error.message });
			return;
		}

		// Map DB rows to the shape the client expects. Some deployments may store
		// `main_pollutants` as a stringified JSON; defensively parse that case here.
		const mapped = (data as any[]).map(row => ({
			city: row.city,
			quality: row.quality,
			qualityScore: row.quality_score,
			lastUpdated: row.last_updated,
			mainPollutants: typeof row.main_pollutants === 'string' ? JSON.parse(row.main_pollutants) : row.main_pollutants
		}));

		res.json(mapped);
		return;
	} catch (err: any) {
		// Catch-all for unexpected errors (parsing, runtime, etc.).
		res.status(500).json({ error: err?.message ?? String(err) });
		return;
	}
};

// GET /water-quality/:city
// Returns a single city summary (from `city_summaries`) plus recent measurements across
// all stations mapped to that city (via `city_station_map`). Measurement results are limited
// and ordered by sample_date desc to keep responses bounded.
const getCityDetail: express.RequestHandler = async (req, res) => {
	const city = String(req.params.city || '');
	try {
		// Fetch the pre-computed city summary. `single()` is used to get one row.
		const { data: summary, error: summErr } = await supabase.from('city_summaries').select('*').eq('city', city).limit(1).single();
		if (summErr && (summErr as any).message !== 'Not Found') {
			// If there's a real DB error (not simply missing row), return 500.
			res.status(500).json({ error: (summErr as any).message });
			return;
		}

		// Load station ids for the city. If none exist, stationIds becomes an empty array.
		const { data: stations } = await supabase.from('city_station_map').select('station_id').eq('city', city);
		const stationIds = (stations as any[] || []).map(s => s.station_id);

		// Query recent measurements across the city's stations. `.in()` with an empty array
		// will return no rows, which is fine — we return an empty measurements array.
		const { data: measurements, error: measErr } = await supabase.from('measurements').select('*').in('station_id', stationIds).order('sample_date', { ascending: false }).limit(100);
		if (measErr) {
			res.status(500).json({ error: measErr.message });
			return;
		}

		// Return both the summary and the measurement page to the client.
		res.json({ summary, measurements });
		return;
	} catch (err: any) {
		res.status(500).json({ error: err?.message ?? String(err) });
		return;
	}
};

// Register routes on the router. The main server mounts this router under an API prefix.
router.get('/water-quality', getSummaries);
router.get('/water-quality/:city', getCityDetail);

export default router;
