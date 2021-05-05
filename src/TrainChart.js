import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, Legend } from 'recharts';


export default function TrainChart({graphData, title}) {
  const theme = useTheme();


  return (
    <React.Fragment>
      
      <ResponsiveContainer>
        <LineChart
          data={graphData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="Day" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              {title}
            </Label>
          </YAxis>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Actual" stroke={theme.palette.primary.main} dot={false} />
          <Line type="monotone" dataKey="Predicted" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}