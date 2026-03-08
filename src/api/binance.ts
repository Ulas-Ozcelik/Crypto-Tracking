export interface CoinData {
    [currency: string]: number;
    usd_24h_change: number;
    try_24h_change: number;
}

export interface CoinResponse {
    [coinId: string]: CoinData;
}

export type ChartData = [number, number][];

export interface CoinDetails {
    market_cap: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_percentage_24h: number;
}

const BINANCE_API_URL = 'https://api.binance.com/api/v3';
const CACHE_DURATION_MS = 1 * 60 * 1000;

const idToSymbol: { [key: string]: string } = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'ripple': 'XRPUSDT',
    'aptos': 'APTUSDT',
    'avalanche': 'AVAXUSDT',
    'chainlink': 'LINKUSDT',
    'polkadot': 'DOTUSDT',
    'solana': 'SOLUSDT',
    'cardano': 'ADAUSDT',
    'dogecoin': 'DOGEUSDT'
};

const circulatingSupply: { [key: string]: number } = {
    'bitcoin': 19650000,
    'ethereum': 120150000,
    'ripple': 54700000000,
    'aptos': 365000000,
    'avalanche': 377000000,
    'chainlink': 587000000,
    'polkadot': 1300000000,
    'solana': 442000000,
    'cardano': 35460000000,
    'dogecoin': 143300000000
};

let tryRatesCache: number | null = null;
let tryRatesTimestamp: number = 0;

function getCachedData<T>(key: string): T | null {
    const cached = localStorage.getItem(key);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
                return parsed.data as T;
            }
        } catch (e) {
        }
    }
    return null;
}

function setCachedData(key: string, data: any): void {
    const cacheObject = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
}

async function getUsdToTryRate(): Promise<number> {
    if (tryRatesCache && (Date.now() - tryRatesTimestamp < CACHE_DURATION_MS)) {
        return tryRatesCache;
    }

    try {
        const response = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=USDTTRY`);
        if (response.ok) {
            const json = await response.json();
            const rate = parseFloat(json.price);
            if (rate > 0) {
                tryRatesCache = rate;
                tryRatesTimestamp = Date.now();
                return rate;
            }
        }
    } catch (e) {
    }

    return 34.0;
}

export async function fetchCryptoPrices(coinIds: string[], currency: string = 'usd'): Promise<CoinResponse | null> {
    const sortedIds = [...coinIds].sort().join(',');
    const cacheKey = `binance_prices_${sortedIds}_${currency}`;
    const cached = getCachedData<CoinResponse>(cacheKey);
    if (cached) return cached;

    try {
        const result: CoinResponse = {};
        let multiplier = 1;
        if (currency === 'try') {
            multiplier = await getUsdToTryRate();
        }

        const validIds = coinIds.filter(id => idToSymbol[id]);
        if (validIds.length === 0) return null;

        const symbolsParam = JSON.stringify(validIds.map(id => idToSymbol[id]));
        const response = await fetch(`${BINANCE_API_URL}/ticker/24hr?symbols=${symbolsParam}`);

        if (!response.ok) {
            throw new Error('Binance API error');
        }

        const data = await response.json();

        data.forEach((item: any) => {
            const coinId = Object.keys(idToSymbol).find(key => idToSymbol[key] === item.symbol);
            if (coinId) {
                const priceUsd = parseFloat(item.lastPrice) || 0;
                const change = parseFloat(item.priceChangePercent) || 0;

                result[coinId] = {
                    usd: priceUsd,
                    try: priceUsd * multiplier,
                    usd_24h_change: change,
                    try_24h_change: change
                };
            }
        });

        if (Object.keys(result).length > 0) {
            setCachedData(cacheKey, result);
            return result;
        }

        return null;
    } catch (error) {
        return null;
    }
}

export async function fetchCryptoNames(coinIds: string[]): Promise<CoinResponse | null> {
    return fetchCryptoPrices(coinIds, 'usd');
}

export async function fetchCoinChart(coinId: string, currency: string = 'usd'): Promise<ChartData | null> {
    const cacheKey = `binance_chart_${coinId}_${currency}`;
    const cached = getCachedData<ChartData>(cacheKey);
    if (cached) return cached;

    const symbol = idToSymbol[coinId];
    if (!symbol) return null;

    try {
        const response = await fetch(`${BINANCE_API_URL}/uiKlines?symbol=${symbol}&interval=15m&limit=96`);
        if (!response.ok) {
            throw new Error('Chart API error');
        }

        let multiplier = 1;
        if (currency === 'try') {
            multiplier = await getUsdToTryRate();
        }

        const data = await response.json();
        const history: ChartData = data.map((point: any) => {
            return [
                point[0],
                parseFloat(point[4]) * multiplier
            ];
        });

        if (history.length > 0) {
            setCachedData(cacheKey, history);
            return history;
        }

        return null;
    } catch (error) {
        return null;
    }
}

export async function fetchCoinDetails(coinId: string, currency: string = 'usd'): Promise<CoinDetails | null> {
    const cacheKey = `binance_details_${coinId}_${currency}`;
    const cached = getCachedData<CoinDetails>(cacheKey);
    if (cached) return cached;

    const symbol = idToSymbol[coinId];
    if (!symbol) return null;

    try {
        const response = await fetch(`${BINANCE_API_URL}/ticker/24hr?symbol=${symbol}`);
        if (!response.ok) {
            throw new Error('Details API error');
        }

        let multiplier = 1;
        if (currency === 'try') {
            multiplier = await getUsdToTryRate();
        }

        const data = await response.json();

        const priceUsd = parseFloat(data.lastPrice) || 0;
        const volumeToken = parseFloat(data.volume) || 0;
        const supply = circulatingSupply[coinId] || 0;

        const detailsParams: CoinDetails = {
            market_cap: supply * priceUsd * multiplier,
            total_volume: volumeToken * priceUsd * multiplier,
            high_24h: parseFloat(data.highPrice) * multiplier,
            low_24h: parseFloat(data.lowPrice) * multiplier,
            price_change_percentage_24h: parseFloat(data.priceChangePercent) || 0
        };

        setCachedData(cacheKey, detailsParams);
        return detailsParams;

    } catch (error) {
        return null;
    }
}
