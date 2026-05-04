import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const VAT_MULTIPLIER = 1.255;
type Tab = 'yesterday' | 'today' | 'tomorrow';

/**
 * Converts the price from EUR/mWh without VAT to snt/kWh with VAT
 * @param priceEURMWH the price in EUR/mWh without VAT
 * @returns the price in snt/kWh with VAT added
 */
const convertPrice = (priceEURMWH: number) => {
  return priceEURMWH * 0.1 * VAT_MULTIPLIER
}

/**
 * GraphQL query provided from AKAMON
 */
const QUERY = `
  query spot_price_chart_SpotPricePeriodicQuery(
    $tenantId: ID!
    $deliveryArea: String!
    $start: String!
    $end: String!
    $resolution: String!
  ) {
    marketPrices {
      periodicSpotPrices(
        tenantId: $tenantId
        deliveryArea: $deliveryArea
        start: $start
        end: $end
        resolution: $resolution
      ) {
        maxPriceWithoutVat
        meanPriceWithoutVat
        minPriceWithoutVat
        period {
          complete
          end
          identifier
          length {
            days
            hours
          }
          start
          type
        }
        unit
      }
    }
  }
`;


function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('today');
  const [dailyPrices, setDailyPrices] = useState<any[]>([]);

  // States for longer period prices
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [periodicPrice, setPeriodicPrice] = useState<any[]>([]);

  const fetchPrices = async (
    start: Dayjs,
    end: Dayjs,
    resolution: string,
    setter: (prices: any[]) => void
  ) => {
    const response = await await fetch('https://graphql.staging.akamon.cloud/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            tenantId: "AKAMON",
            deliveryArea: "FI",
            start: start.startOf('day').toISOString(),
            end: end.endOf('day').toISOString(),
            resolution,
          },
        }),
      });
 
      const result = await response.json();
      setter(result.data.marketPrices.periodicSpotPrices);
      console.log(result)
  }

  /**
   * Getting today's prices when the page is loaded
   */
  useEffect(() => {
    const today = dayjs();

    fetchPrices(
      today,
      today,
      "hour",
      setDailyPrices
    )
  }, []);

  /**
   * Fetching the data with GraphQL, updating every time a date range is selected 
   * with datePickers. If either of the dates are null, it doesn't update.
   */
  useEffect(() => {
    if (!startDate || !endDate) return;

    fetchPrices(
      startDate,
      endDate,
      "month",
      setPeriodicPrice
    );
    console.log(periodicPrice);

  }, [startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <h1>Today:</h1>
        <h2>Start Date</h2>
        <DatePicker 
          value={startDate}
          onChange={(newDate) => setStartDate(newDate)}
          format="DD/MM/YYYY"
        />
        <h2>End Date</h2>
        <DatePicker
          minDate={startDate ?? undefined}
          value={endDate}
          onChange={(newDate) => setEndDate(newDate)}
          format="DD/MM/YYYY"
        />
        <h2>Displaying dates</h2>
        <p>
          {startDate?.format('D.M') || 'None'} to {endDate?.format('D.M') || 'None'}
        </p>
        <h2>Test price:</h2>
        <p>{periodicPrice !== null ? convertPrice(periodicPrice[0]?.meanPriceWithoutVat).toFixed(2) + ' snt/kWh' : 'Loading...'}</p>
        <p></p>
      </div>
    </LocalizationProvider>
  );
}

export default App;