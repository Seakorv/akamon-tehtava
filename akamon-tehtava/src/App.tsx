import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//import axios from 'axios';
// TODO: MUI date picker jossain välissä

function App() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
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
        <h1>Displaying dates</h1>
        <p>Start date is {startDate?.format('DD.MM.YYYY') || 'None'}</p>
        <p>End date is {endDate?.format('DD.MM.YYYY') || 'None'}</p>
      </div>
    </LocalizationProvider>
  );
}

export default App;