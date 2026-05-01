import { useState, useEffect } from 'react';
//import axios from 'axios';
// TODO: MUI date picker jossain välissä

function App() {
  const [startDate, setStartDate] = useState(Date);
  const [endDate, setEndDate] = useState(Date);

  return (
    <div>
      <h1>{startDate}</h1>
      <input
        type='startDate'
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>
  );
}

export default App;