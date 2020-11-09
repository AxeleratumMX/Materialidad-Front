import React from 'react';
import StatusBar from '../components/statusBar/StatusBar.js';
import Access from '../components/getAccess';

export default class Contracts extends React.Component {
    constructor(){
        super()
        this.state = {
            itemAccess: 0,
            openAccess: false,
            activeDrop: false,
            titles: ['TITLTE','STATUS','validate','DOWNLOAD'],
            data: [
                {
                    title: 'Buy red Mazda car',
                    status: false,
                    download: false
                },
                {
                    title: 'Buy blue Mazda car',
                    status: true,
                    download: false
                },
                {
                    title: 'Buy yellow Mazda car',
                    status: false,
                    download: false
                },
                {
                    title: 'Buy white Mazda car',
                    status: true,
                    download: false
                },
                {
                    title: 'Buy black Mazda car',
                    status: false,
                    download: false
                },
                {
                    title: 'Buy gray Mazda car',
                    status: true,
                    download: false
                },
                {
                    title: 'Buy gold Mazda car',
                    status: false,
                    download: false
                },
                {
                    title: 'Buy silver Mazda car',
                    status: true,
                    download: false
                }
            ]
        }
    }
    dropDown(){
        //Cambia el estado del DropDown en el botón de filtrar
        this.setState({activeDrop:!this.state.activeDrop})
    }
    changeActive(index){
        //Evalia si es posible cambiar a activo el contrato, de lo contrario no hace nada
        if (!this.state.data[index].status){
            //Reporta hacia cuál item se debe de hacer el cambio de estado de ser posible
            this.setState({itemAccess:index})
            this.openAccess(true)
        }
    }
    openAccess(access){
        //Abre el modal de acceso para pedir las credenciales del usuario
        this.setState({openAccess:access})
    }
    reportAccess(report){
        //Manda a cerrar el modal de acceso
        this.openAccess(report.modal)
        //Si se le otorgó acceso permite la funcionalida de cambio de estatus
        if(report.access){
            let stateCopy = Object.assign({}, this.state);
            stateCopy.data[report.index].status = !this.state.data[report.index].status
            this.setState(stateCopy)
        }
    }
    fillTableTitle(){
        //Añade los títulos a la tabla de gestión de contratos
        let table = [];
        for (let i = 0; i < this.state.titles.length; i++) {
            table.push(<th style={{textAlign:'center',color:'#8D213C',padding:'10px'}}>{this.state.titles[i]}</th>)
        }
        return table;
    }
    fillTable(){
        //Llena el contendio de la tabla con el json proporcionado en las variables de entrada de la clase
        let table = [];
        for (let i = 0; i < this.state.data.length; i++) {
            let isActive = this.state.data[i].status
            table.push(<tr>
                <td className={isActive ? '':'negative'} style={{paddingLeft:'30px'}}>{this.state.data[i].title}</td>
                <td className={isActive ? '':'negative'} style={{textAlign:'center'}}>{isActive ? 'Active':'Pending'}</td>
                <td className={isActive ? '':'negative'} style={{textAlign:'center'}}><i className={isActive ? 'large icon power off green':'large icon power off grey'} onClick={() => this.changeActive(i)}></i></td>
                <td className={isActive ? '':'negative'} style={{textAlign:'center'}}><i className="large secondary icon cloud download"></i></td>
            </tr>)
        }
        return table;
    }
    render(){
        const style = {
            container:{
                height: '80%',
                width: '85%',
                marginTop: '50px'
            },
            cell:{
                padding: '5px 20px',
                textAlign: 'center'
            },
            tableTitle:{
                fontSize: '1.3em'
            }
        }
        return(
            <div className="bodyContainer">
                <StatusBar/>
                <div style={style.container} className="ui container">
                    <div className="ui grid">
                        <div className="four column row">
                            <div className="right floated column">
                                <div className="ui big floating labeled icon dropdown button" onClick={() => this.dropDown()}>
                                    <i className="filter icon"></i>
                                    <span className="text">Order by...</span>
                                    <div className={'menu ' + (this.state.activeDrop ? 'transition visible':'')} >
                                        <div className="header">
                                        Filter by
                                        </div>
                                        <div className="divider"></div>

                                        <div className="item">
                                        <span className="text">Important</span>
                                        </div>
                                        <div className="item">
                                        <span className="text">Hopper</span>
                                        </div>
                                        <div className="item">
                                        <span className="text">Discussion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right floated column">
                                <div class="ui big action input">
                                    <input type="text" placeholder="Search..."/>
                                    <button className="ui icon button">
                                        <i className="search icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="ui very basic table" style={{backgroundColor:'white'}}>
                        <thead style={style.tableTitle}>
                            <tr>
                                {this.fillTableTitle()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.fillTable()}
                        </tbody>
                    </table>
                </div>
                <Access open={this.state.openAccess} index={this.state.itemAccess} reportClose={this.reportAccess.bind(this)}/>
            </div>
        )
    }
}
