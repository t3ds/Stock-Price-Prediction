import React, { useEffect,useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
const axios = require('axios');


export default function ListModel({trainFlag, predicted_data, loadFlag}) {
    
    const [models, setModels] = useState(null);
    
    function UpdateModels(){

        if(models === null){
            return (<ListItem button key = {"default"}>
                        <ListItemText primary="" />
                    </ListItem>)
        }
        return models.map((model) => (
            <React.Fragment>
          <ListItem button key = {model.name} id = {model.name} onClick= {(e) => clickMe(e)}>
              <ListItemText primary={model.name} secondary={model.date}/>
          </ListItem>
          <Divider />
          </React.Fragment>
        ))
  }
  function updateStuff(response){
      console.log(response)
      predicted_data(response.data)
      loadFlag(false)

  }
  function clickMe(e) {
    e.preventDefault()
    loadFlag(true);
    var params = new URLSearchParams();
    params.append("ticker", e.currentTarget.id)
    params.append("days",document.querySelector('[aria-label="days"]').value)

    var request = {
        params: params
    }
    axios.get('/predict', request).then((response) => {updateStuff(response)});
    
        {/*fetchStock(element.value)*/}
  }

    useEffect(() => {
        axios.get('/models').then(response => setModels(response.data));
    }, [trainFlag]);

    return(
    <List component="nav" aria-label="model list">
        <UpdateModels /> 
    </List>
    );
}