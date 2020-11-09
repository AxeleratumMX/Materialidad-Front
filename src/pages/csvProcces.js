import React, { useState, useEffect } from 'react';
import Papa from "papaparse";
import StatusBar from '../components/statusBar/StatusBar.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import CommentIcon from '@material-ui/icons/Comment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import '../assets/font.css';
import {Container,Typography,Card,Grid} from '@material-ui/core';
export default class Contracts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            csvfile: undefined,
            loading:true,
            success:true
        }
    }

   


    render() {
        return (
        <React.Fragment>
           
            <div  className="bodyContainer">
                    <StatusBar/>
                        <Container style={{height:'80vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                            <Card style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',width:'400',height:'200',padding:'2rem'}}>
                                <Grid container>
                                    <Typography style={{fontSize:'2rem',marginLeft:'10rem',fontFamily: 'Montserrat, medium '}}>CSV PROCCESS</Typography>
                                </Grid>
                                <Grid>
                                <div  className="bodyContainer">
                                    <div class="ui left icon input">
                                        <input
                                            class="ui google plus button"
                                             type="file"
                                               ref={input => {
                                                    this.filesInput = input;
                                                    }}
                                                    name="file"
                                                placeholder={null}
                                            onChange={this.handleChange} />
                                        <i aria-hidden="true" class="file icon"></i>
                                        <button class="ui teal icon left labeled button"
                                            onClick={this.importCSV}>
                                            <i aria-hidden="true" class="upload icon"></i>
                                            Upload now!
                                            </button>
                                        </div>
                                        
                                        </div>
                                        
                                </Grid>
                                {this.state.success ===false ?<Grid>
                                    <CheckCircleIcon style={{color:'green'}}/>Upload Succes..!
                                </Grid>:''}         
                            </Card>
                    </Container>
            </div>
        </React.Fragment>
        )}

        handleChange = event => {
            this.setState({
                csvfile: event.target.files[0]
            });
        };
    
        importCSV = () => {
            this.setState({ success: false });
            const { csvfile } = this.state;
            Papa.parse(csvfile, {
                complete: this.saveContracth,
                header: true
            });
        };

      
        saveContract(result){
            var data = result.data;
            let r={};
            r=result.data;
            console.log("json rr",r[0]);

            let jsonObjetc = JSON.stringify(data[0]);
            let jsonFormatted = JSON.parse(jsonObjetc);
            let paramas={};  
            let oParams = {};
            oParams=jsonFormatted;
        
            paramas=JSON.stringify(Object.assign({},oParams));
            console.log("oparams",oParams);
    
           const proxy = "https://cors-anywhere.herokuapp.com/";
           let url="http://smartcm.eastus.cloudapp.azure.com:3000/v0/csv/";
               fetch(proxy+url,{
                   method:'POST',
                   headers: {
                       'Content-Type': 'application/json',  
                   }, body:paramas
                
               })
               .then(response => response.json())
               .then(contents => console.log("cpntentes",contents))
               
               .catch(() => console.log("Can’t access  response. Blocked by browser?"))
             }
}
