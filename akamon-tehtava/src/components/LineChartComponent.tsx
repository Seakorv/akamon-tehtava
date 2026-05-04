import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const LineChartComponent = ({ lineChartData, TooltipComponent }: any) => {
    return (
        <div className="line-chart" >
            <ResponsiveContainer>
                <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3" />
                    <XAxis dataKey="date" />
                    <YAxis width="auto" />
                    <Tooltip content={<TooltipComponent />}/>
                    <Line
                        type="monotone"
                        dataKey="price"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};