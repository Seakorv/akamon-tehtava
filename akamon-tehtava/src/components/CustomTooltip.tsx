/**
 * Tooltips for the bars from Recharts. 
 * @param param0
 * @returns 
 */
export const CustomTooltip = ({ payload, label, active }: any) => {
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