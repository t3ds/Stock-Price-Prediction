import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(Date, Price) {
  return { Date, Price };
}

var data = [
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
  createData('', undefined),
];

export default function Chart({graphData}) {
  const theme = useTheme();

  React.useEffect(()=>{
   if(!graphData){
     console.log("ayo")
    }

  else{

    var new_data = [];

    for(var i=0; i<graphData.length; i++){
      new_data.push(createData(graphData[i]["Date"], graphData[i]["Price"]))
    }

  {/*data = new_data*/}
    console.log(graphData.length)
  }
  },[graphData]);

  if(graphData !== null){
    data = graphData
  }

  return (
    <React.Fragment>
      
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="Date" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Price
            </Label>
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="Price" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}