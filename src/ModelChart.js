import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Typography from '@material-ui/core/Typography';


export default function Chart({graphData}) {
  const theme = useTheme();
  
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Day ${label}`}</p>
          <p className="intro">{`Open: ${graphData[parseInt(label)]["Open"]}`}</p>
          <p className="intro">{`High: ${graphData[parseInt(label)]["High"]}`}</p>
          <p className="intro">{`Low: ${graphData[parseInt(label)]["Low"]}`}</p>
          <p className="intro">{`Close: ${graphData[parseInt(label)]["Close"]}`}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" gutterBottom>
        Prediction For {graphData.length -1} Day(s)
      </Typography>
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
              Price
            </Label>
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="Close" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

  
  