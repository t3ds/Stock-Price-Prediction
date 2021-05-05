import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import ListModel from './ListModel'
import ModelDayInput from './ModelDayInput';
import Typography from '@material-ui/core/Typography';
import ModelChart from './ModelChart';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import Title from './Title';

import { ContactsOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'row',
      },
      fixedHeight: {
        height: 240,
      },
}));

export default function PredictionContainer({trainFlag}){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    


    useEffect(()=>{
        console.log(loading)
    }, [loading]);

    function UpdateComponent(){
        if(data == null){
            return (
            <Grid container xs = {6} spacing ={8} justify="center" alignItems="center" direction="column">
                <Grid item justify="center">
                    <Typography component="h2" variant="h6" gutterBottom>
                        Please Enter a Stock
                    </Typography>
                </Grid>
            </Grid>)
        }

        else{
            return (
                <Grid container xs = {6} spacing ={5} justify="center" alignItems="center" direction="column">
                    <Grid item justify= "center" alignItems="flex-end">
                        <Typography component="h2" variant="h6" gutterBottom>
                        {data[data.length -1]["Close"]}
                        </Typography>
                    </Grid>
                </Grid>    
            )
        }
        
    }
    


    
    return(

    <React.Fragment>
        <Title>Make a Prediction!</Title>

            <Grid container direction="row">

                <Grid container xs ={6} direction="column" alignItems = "stretch">
                    <Grid item >
                        <ModelDayInput />
                    </Grid>

                    <Grid item>
                    <ListModel trainFlag ={trainFlag} predicted_data = {setData} loadFlag = {setLoading}/>
                        
                    </Grid>
                    
                
                </Grid>
                <Divider orientation="vertical" flexItem />
                <UpdateComponent />
                <Divider />

                {
                    (data === null)
                    ?(
                    <Grid container xs = {12}  justify = "center">
                        {(loading === true)
                        ?<CircularProgress />
                        :
                        (<Typography component="h2" variant="h6" gutterBottom>
                            Enter the Number of Days and the Stock
                        </Typography>)}
                    </Grid>)
                    :(<Grid container xs = {12}  justify = "center">
                        {(loading === true)
                        ?<CircularProgress />
                        :
                        (<Grid item>
                        <Paper className={fixedHeightPaper}>
                            <ModelChart graphData = {data} />
                        </Paper>
                    </Grid>)}
                    </Grid>)
                }
            </Grid>
                
                
    </React.Fragment>

    );
}