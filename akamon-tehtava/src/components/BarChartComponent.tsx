import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const BarChartComponent = ({ barChartData, ToolTipComponent }: any) => {
    return (
        <div className="bar-chart" >
          <ResponsiveContainer>
            <BarChart data={barChartData}>
              <XAxis
                dataKey="time"
                scale="band"
              />
              <YAxis />
              <Tooltip content={<ToolTipComponent />} />
              <Bar dataKey="price" fill="#61de2a"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
    );
};