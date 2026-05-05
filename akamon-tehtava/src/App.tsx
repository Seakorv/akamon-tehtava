import { useState, useEffect, useDebugValue } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { fetchPrices } from './api/spotPrices';
import { convertPrice } from './utils/convertPrice'
import { CustomTooltip } from './components/CustomTooltip';
import { BarChartComponent } from './components/BarChartComponent';
import { LineChartComponent } from './components/LineChartComponent';
import { getDailyMax } from './utils/dailyMaxNumber';
import { getDailyMin } from './utils/dailyMinNumber';

type DayTab = 'yesterday' | 'today' | 'tomorrow';
type PeriodicToggle = 'daily' | 'monthly';

export type SpotPrice = {
  maxPriceWithoutVat: number;
  minPriceWithoutVat: number;
  meanPriceWithoutVat: number;
  period: {
    start: string;
  };
};

function App() {
  const [currentTab, setCurrentTab] = useState<DayTab>('today');
  const [dailyPrices, setDailyPrices] = useState<any[]>([]);

  // States for longer period prices
  const [periodicPrice, setPeriodicPrice] = useState<any[]>([]);
  const [dayMonthButton, setDayMonthButton] = useState<PeriodicToggle>('daily');

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
   * setting the barchart again, when the yesterday/today/tomorrow tabs are pressed
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
   * Getting the linechart's prices from start of the year. dayMonthButton changes if it is
   * daily prices or monthly prices
   */
  useEffect(() => {
    const startYear = dayjs().startOf("year");
    const today = dayjs();

    const resolution = dayMonthButton === "daily" ? "day" : "month";

    fetchPrices(
      startYear,
      today,
      resolution,
      setPeriodicPrice
    )
  }, [dayMonthButton]);

  const toggleButton = () => {
    setDayMonthButton(previous => 
      previous === "daily" ? "monthly" : "daily"
    );
  };

  /**
   * Finding the current hourly price object
   */
  const currentHourlySpotPrice = dailyPrices.find(
    (spotPrice) => dayjs(spotPrice.period.start).hour() === dayjs().hour()
  );

  const onTabClick = (tab: DayTab) => {
    setCurrentTab(tab);
  };


  const { dailyMaxNumber } = getDailyMax(dailyPrices);
  const { dailyMinNumber } = getDailyMin(dailyPrices);
    
  /**
   * Mapping the daily price data for the barchart here. 
   */
  const barChartData = dailyPrices.map((spotPrice) => ({
    time: dayjs(spotPrice.period.start).format("H"),
    price: convertPrice(spotPrice.meanPriceWithoutVat)
  }));

  /**
   * Mapping the daily price data from start of the year for
   * the line chart
   */
  const lineChartData = periodicPrice.map((spotPrice) => ({
    date: dayjs(spotPrice.period.start).format("D.M"),
    price: convertPrice(spotPrice.meanPriceWithoutVat)
  }));

  return (
      <div className="App">
        {currentTab === "today" && 
          <h2>Price now: {
            currentHourlySpotPrice
              ? convertPrice(currentHourlySpotPrice.meanPriceWithoutVat).toFixed(2)
              : "..."
          } c/kWh
        </h2>
        }
        <div className='tab-buttons'>
          {(["yesterday", "today", "tomorrow"] as DayTab[]).map((tab) => (
            <button
              key={tab}
              className={currentTab === tab ? "active" : ""}
              onClick={() => onTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <h3>{currentTab.toUpperCase()}:</h3>
        <p>Max quarterly price: {
            dailyMaxNumber !== null
              ? convertPrice(dailyMaxNumber).toFixed(2)
              : "..."
          } c/kWh
        </p>
        <p>Min quarterly price: {
            dailyMinNumber !== null
              ? convertPrice(dailyMinNumber).toFixed(2)
              : "..."
          } c/kWh
        </p>
        
        <BarChartComponent
          barChartData={barChartData}
          ToolTipComponent={CustomTooltip}
        />

        <h1>Prices this year</h1>
        <div className='tab-buttons'>
          <button onClick={toggleButton}>
            {dayMonthButton === "daily" ? "Show monthly" : "Show daily"}
          </button>
        </div>

        <LineChartComponent
          lineChartData={lineChartData}
          TooltipComponent={CustomTooltip}
        />
        
      </div>

  );
}

export default App;