import { useState, useEffect, useDebugValue } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipProps } from "recharts";

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
  //const [currentSpotPrice, setCurrentSpotPrice] = useState<Number>();

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
    const response = await fetch('https://graphql.staging.akamon.cloud/', {
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
   * setting the table again, when the yesterday/today/tomorrow tabs are pressed
   */
  useEffect(() => {
    const dayModifiers = { yesterday: -1, today: 0, tomorrow: 1 };
    const day = dayjs().add(dayModifiers[currentTab], 'day');

    fetchPrices(
      day,
      day,
      "hour",
      setDailyPrices
    )
  }, [currentTab]);

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

  /**
   * Finding the current hourly price object
   */
  const currentHourlySpotPrice = dailyPrices.find(
    (spotPrice) => dayjs(spotPrice.period.start).hour() === dayjs().hour()
  );

  const onTabClick = (tab: Tab) => {
    setCurrentTab(tab);
  };

  /**
   * Using reduce function to find the max daily (quarter hour) price from the dailyHourPrices.
   * Reduce first compares array's current item's (quarterPrice) maxPrice with current candidate to be a max value.
   * then if it is, it sends the hourPrice to the next iteration's max and so on. If not, the max value stays the same.
   * dailyPrices[0] is the initial value, so starting from the beginning of the array.
   * Also checking if dailyPrices even exist by checking its lenght. If not, returning null
   */
  const dailyMaxObject = dailyPrices.length
    ? dailyPrices.reduce((max, quarterPrice) =>
        quarterPrice.maxPriceWithoutVat > max.maxPriceWithoutVat 
          ? quarterPrice 
          : max
      )
    : null;
  
  /**
   * Converting the object to a number
   */
  const dailyMaxNumber = dailyMaxObject?.maxPriceWithoutVat ?? null;

  const dailyMinObject = dailyPrices.length
    ? dailyPrices.reduce((min, quarterPrice) =>
      quarterPrice.minPriceWithoutVat < min.minPriceWithoutVat
        ? quarterPrice
        : min
      )
    : null;

  const dailyMinNumber = dailyMinObject?.minPriceWithoutVat ?? null;
  
  /**
   * Mapping the daily price data for the barchart here. 
   */
  const barChartData = dailyPrices.map((spotPrice) => ({
    time: dayjs(spotPrice.period.start).format("H"),
    price: convertPrice(spotPrice.meanPriceWithoutVat)
  }));

  /**
   * Tooltips for the bars from Recharts. 
   * @param param0
   * @returns 
   */
  const CustomTooltip = ({ payload, label, active }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const value = payload[0].value as number;

    return (
      <div style={{ background : "#d2ffbe", padding: 8, border: "1px solid #f0f0f0" }}>
        <p>{label}</p>
        <p>
          {value.toFixed(2)} c/kWh
        </p>
      </div>
    );
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        {currentTab === "today" && 
          <h2>Price now: {
            currentHourlySpotPrice
              ? convertPrice(currentHourlySpotPrice.meanPriceWithoutVat).toFixed(2)
              : "..."
          } c/kWh
        </h2>
        }
        <div className="tab-buttons">
          <button onClick={() => onTabClick("yesterday")}>
            Yesterday
          </button>
          <button onClick={() => onTabClick("today")}>
            Today
          </button>
          <button onClick={() => onTabClick("tomorrow")}>
            Tomorrow
          </button>
        </div>
        <h3>{currentTab.toUpperCase()}:</h3>
        <p>Max Price: {
            dailyMaxNumber
              ? convertPrice(dailyMaxNumber).toFixed(2)
              : "..."
          } c/kWh
        </p>
        <p>Min Price: {
            dailyMinNumber
              ? convertPrice(dailyMinNumber).toFixed(2)
              : "..."
          } c/kWh
        </p>
        <BarChart width={800} height={400} data={barChartData}>
          <XAxis
            dataKey="time"
            interval={0}
            padding={{ left: 0, right: 0}}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="price" fill="#61de2a"/>
        </BarChart>
        {/*
        <div className="date-pickers">
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
        </div>
        <h2>Displaying dates</h2>
        <p>
          {startDate?.format('D.M') || 'None'} to {endDate?.format('D.M') || 'None'}
        </p>
        <h2>Test price:</h2>
        <p>{periodicPrice !== null ? convertPrice(periodicPrice[0]?.meanPriceWithoutVat).toFixed(2) + ' snt/kWh' : 'Loading...'}</p>
        <p></p>
        */}
      </div>
    </LocalizationProvider>
  );
}

export default App;