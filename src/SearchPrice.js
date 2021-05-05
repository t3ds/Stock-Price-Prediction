import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchPrice({graphData, graphFunc}) {
  const classes = useStyles();

  const [stockData, setStockData] = useState(0);
  function fetchStock(ticker) {
    const link = '/api/' + String(ticker)
    fetch(link).then(
      response => response.json()
    ).then(data => setStockData(data))

    const history = '/history/' + String(ticker)
    fetch(history).then(
      response => response.json()
    ).then(data => graphFunc(data))
  };

  

  useEffect(() => {
    if (stockData["companyName"] !== undefined){
      document.getElementById("stock_price").innerHTML = stockData["averagePrice"];
      document.getElementById("stock_name").innerHTML = stockData["companyName"];
      console.log(graphData)

    }
    else{
      document.getElementById("stock_price").innerHTML = "----";
      document.getElementById("stock_name").innerHTML = "-------";
    }
    
  }, [fetchStock]);

  function clickMe(e) {
    e.preventDefault()
    var element = document.querySelector('[aria-label="search symbol"]');
    {/*console.log(element.value}*/}
    fetchStock(element.value)
    
  }

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Enter Symbol"
        inputProps={{ 'aria-label': 'search symbol' }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick= {(e) => clickMe(e)}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}