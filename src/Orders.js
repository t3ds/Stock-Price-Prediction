import React, {useState, useEffect, Fragment} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import htmlparser2 from 'html-react-parser';
import Title from './Title';

// Generate Order Data
function createData(symbol, highPrice, lowPrice, ltp, tradedQuantity) {
  return { symbol, highPrice, lowPrice, ltp, tradedQuantity};
}

{/*createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
  createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
  createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),*/}
const rows = [
  createData('-----', '-----', '-----', '-----', "-----"),
  createData('-----', '-----', '-----', '-----', "-----"),
  createData('-----', '-----', '-----', '-----', "-----"),
  createData('-----', '-----', '-----', '-----', "-----"),
  createData('-----', '-----', '-----', '-----', "-----")
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders({ flag }) {
  const classes = useStyles();
  
  console.log(typeof("/"+flag))
  const [value, setValue] = useState(null);
  {/*function updateHTML(gain){
    {var element = parse(`<TableRow key=${gain.symbol}></TableRow>`)
  console.log(element)}

    let doc = React.createElement(`<TableRow key=${gain.symbol}>
    <TableCell>${gain.symbol}</TableCell>
    <TableCell>${gain.lowPrice}</TableCell>
    <TableCell>${gain.highPrice}</TableCell>
    <TableCell>${gain.ltp}</TableCell>
    <TableCell align="right">${gain.tradedQuantity}</TableCell>
  </TableRow>`)
    console.log(doc)
    document.getElementById("gainer_list").innerHTML = doc
    
          
  }*/}
  

  function getValue(){
    if(flag === 'Gainers'){
      fetch('/gainers').then(
        response => response.json()
      ).then(data => setValue(data))
    }

    else{
      fetch('/losers').then(
        response => response.json()
      ).then(data => setValue(data))
    }
      
  }
  useEffect(() => {
      let timerFunc = setInterval(() => {
        getValue()
      }, 10000);
      
      return () => clearInterval(timerFunc);
    });


    function UpdateValue(){

      if(value != null) {
        return value.map((val) => (
        <TableRow key={val.symbol}>
          <TableCell>{val.symbol}</TableCell>
          <TableCell>{val.highPrice}</TableCell>
          <TableCell>{val.lowPrice}</TableCell>
          <TableCell>{val.ltp}</TableCell>
          <TableCell align="right">{val.tradedQuantity}</TableCell>
        </TableRow>
      ))
      }
      
      return rows.map((row) => (
        <TableRow key={row.symbol}>
          <TableCell>{row.symbol}</TableCell>
          <TableCell>{row.highPrice}</TableCell>
          <TableCell>{row.lowPrice}</TableCell>
          <TableCell>{row.ltp}</TableCell>
          <TableCell align="right">{row.tradedQuantity}</TableCell>
        </TableRow>
      ))

  }


  
  return (
    <React.Fragment>
      <Title>{"Top " + flag}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>High Price</TableCell>
            <TableCell>Low Price</TableCell>
            <TableCell>LTP</TableCell>
            <TableCell align="right">Traded Quantity</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody id="gainer_list">
          
          <UpdateValue />

        

        </TableBody>
      </Table>

    </React.Fragment>
    
  );
}