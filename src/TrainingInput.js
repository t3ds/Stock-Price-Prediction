import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
const axios = require('axios');

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

export default function TrainingInput({trainer, setTrainer, trainVar, loadFlag}) {
  const classes = useStyles();


  function updateParameters(response){
    trainVar(response.data)
    loadFlag(false)
    trainer === false ? setTrainer(true) : setTrainer(true)
    console.log(trainer)
  }
  function clickMe(e) {
    e.preventDefault()
    loadFlag(true)
    var element = document.querySelector('[aria-label="train search"]');

    if(element.value === ""){
      loadFlag(false)
      return
    }
    var link = "/train/".concat(element.value);
    //console.log(typeof(element.value))
    //console.log(element.value)

    axios.get(link).then((response) => {updateParameters(response)});
  }

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Enter Symbol"
        inputProps={{ 'aria-label': 'train search' }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick= {(e) => clickMe(e)}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}