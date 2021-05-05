import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import ModelDayInput from './ModelDayInput';
import Typography from '@material-ui/core/Typography';
import ModelChart from './ModelChart';
import TrainingInput from './TrainingInput';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import Title from './Title';
import TrainChart from './TrainChart'
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

      detailTitle: {
        textDecoration: "underline"
      },

      textSpacing: {
          paddingTop: theme.spacing(2)
      }
}));

export default function TrainingContainer({trainFlag, trainUpdate}){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        console.log(loading)
    }, [loading]);


    function ShowGraph({value_train, value_test, title}){
        return (
            <Grid container xs={12} justify="center" alignItems = "center">
                    <Grid item xs = {6}>
                        <Paper className={fixedHeightPaper}>
                            <TrainChart graphData = {value_train} title = {title} />
                        </Paper>
                    </Grid>
                    
                    <Grid item xs= {6}>
                        <Paper className={fixedHeightPaper}>
                            <TrainChart graphData = {value_test} title = {title} />
                        </Paper>
                    </Grid>
            </Grid>
        )
    }

    return(

    <React.Fragment>
        <Title>Train a Model!</Title>
            
            <Grid container xs = {12} direction="column" justify = "center" alignItems="center">

                <Grid container alignItems = "stretch">
                    <Grid item xs={12}>
                        <TrainingInput trainer = {trainFlag} setTrainer = {trainUpdate} trainVar = {setData} loadFlag = {setLoading}/>
                    </Grid>
                </Grid>
                
                {(data === null)
                ?(<Grid container xs = {12} justify = "center">
                    {(loading === true)
                        ?<CircularProgress />
                        :
                        (<Typography component="h2" variant="h6" className={classes.textSpacing} gutterBottom>
                            Enter the Stock Symbol
                        </Typography>)}
                </Grid>)
                :(loading === true)
                    ?(<Grid container xs = {10} direction="row" justify = "center" alignItems= "center">
                        <CircularProgress />
                    </Grid>)
                    :(<>
                        <Grid container xs = {10} direction="row" justify = "center" alignItems= "center">
                            <Grid container xs = {5} direction="column" justify="center" alignItems="center">
                                <Typography component="h2" variant="h6" className={classes.detailTitle} gutterBottom>
                                    RMSE Train
                                </Typography>

                                <Typography component="h3" variant="h6" gutterBottom>
                                    {data["Accuracy"]["Train"]}
                                </Typography>
                            </Grid>

                            <Divider orientation="vertical" flexItem />

                            <Grid xs = {5} container direction="column" justify="center" alignItems="center">

                                <Typography component="h2" variant="h6" className={classes.detailTitle} gutterBottom>
                                    RMSE Test
                                </Typography>

                                <Typography component="h3" variant="h6" gutterBottom>
                                    {data["Accuracy"]["Test"]}
                                </Typography>
                            </Grid>
                        </Grid>

                    <Grid container xs={10} direction = "row" alignItems = "center" justify = "center">
                        <Grid container xs = {5} direction="column" justify="center" alignItems="center" >
                            <Typography component="h3" variant="h6" className={classes.detailTitle} gutterBottom>
                                Train
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        
                        <Grid container xs = {5} direction="column" justify="center" alignItems="center" >
                            <Typography component="h3" variant="h6" className={classes.detailTitle} gutterBottom>
                                Test
                            </Typography>
                        </Grid> 
                    </Grid>

                    
                    <ShowGraph value_train= {data["Train"]["Open"]} value_test = {data["Test"]["Open"]} title = {"Open"} />
                    <ShowGraph value_train= {data["Train"]["High"]} value_test = {data["Test"]["High"]} title = {"High"} />
                    <ShowGraph value_train= {data["Train"]["Low"]} value_test = {data["Test"]["Low"]} title = {"Low"} />
                    <ShowGraph value_train= {data["Train"]["Close"]} value_test = {data["Test"]["Close"]} title = {"Close"} />
                    
                    </>
                    )}
                    

                

            </Grid>
                
                
    </React.Fragment>

    );
}