import React from 'react';
import Candado from '../assets/ico_contra.svg'
import Correo from '../assets/ico_correo.svg'
import Acceso from '../assets/ico_acceso_1.svg'



export default class AccesApi extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            activeLoader: '',
            wrongField:['',''],
            errorMessage: [false,false],
            email: '',
            pass: '',
            activarModal: false
        }
    }
    handlerModal(state){
        //Cambia el estado del modal
        this.setState({activarModal:state})
    }
    componentWillReceiveProps(nextProp){
        //Recibe del componente padre cuando se debe abrir el modal
        this.handlerModal(nextProp.open)
    }
    closeAccess(){
        //Reporta al componente padre el cierre dle modal, sin hacer ningún cambio
        this.props.reportClose({modal:false,access:false,index:0})
        this.setState({email:'',pass:''})
    }
    validate(){
        console.log("props login");
        console.log("entro validar data ",this.props);
        let active = this.validateFormatFields() ? 'active' : '';
        //Activa el loader de carga mientras hace la validación en Backend
        console.log("entro validar data ",active);
        this.setState({activeLoader: active});

        //Cambiar esta función por la llamda al API de sesión
        setTimeout(() => {
            //Desactiva la espera del loader
            this.setState({activeLoader: ''});
            if(this.validateFormatFields()){
                console.log("validateFormatFields ",this.props);
                console.log("validateFormatFields ",this.props.reportClose);
                this.props.reportClose({modal:false,access:true,index:this.props.index,validate:true})
                this.setState({email:'',pass:''})
            }
        },2500);
    }
    validateFormatFields(){
        //Expresión regular de Email
        const regexEmail = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",'i');
        //Expresión regular de Contraseña - Al menos una minúscula, una mayúscula, un dígito y un caracter especial
        const regexPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})",'i');
        //Hace las comparaciones con las expresiones regulares
        let match1 = regexEmail.exec(this.state.email);
        let evalEmail = match1 == null ? 'error' : '';
        let match2 = regexPass.exec(this.state.pass);
        let evalPass = match2 == null ? 'error' : '';

        let verifyEmail = evalEmail === 'error'
        let verifyPass = evalPass === 'error' 
        //Seteo de estilos en campos
        this.setState({wrongField: [evalEmail,evalPass],errorMessage: [verifyEmail,verifyPass]})
        //Evaluación de formato para ambos campos
        console.log("!verifyEmail && !verifyPass",!verifyEmail && !verifyPass);
        return !verifyEmail && !verifyPass
    }
    handleErrorMessage(index){
        //Se copia el estado actual de las variables
        let stateCopy = Object.assign({}, this.state);
        //Se cambia el valor del error message por su negación, en la posición index
        stateCopy.errorMessage[index] = !this.state.errorMessage[index]
        //Se actualiza el estado de las vriables
        this.setState(stateCopy)
    }
    render(){
        const style = {
            modal:{
                width: '350px',
                position: 'relative',
                margin: '0 auto',
                top: '30%',backgroundColor:' #f1f3f4'
            }
        }
        return(
            <div  className={'ui dimmer modals page transition ' + (this.state.activarModal ? 'visible active':'hidden')}>
                <div  className="ui transition visible active modal" style={style.modal}>
                    <div className={'ui inverted dimmer ' + this.state.activeLoader}>
                        <div className="ui text loader">Cargando...</div>
                    </div>
                    <div style={{width:'auto'}} className="header">Accesos<i className="large icon close red" onClick={() => this.closeAccess()} style={{float:'right'}}></i></div>
                    <div className="ui large form error">
                        <div className="ui stacked segment">
                            <div className={'field ' + this.state.wrongField[0]}>
                                <div style={{width:'auto',marginLeft: '20px'}} className="ui left icon labeled input">
                                <button style={{marginLeft: '10px',paddingRight:'-10px'}} className="ui icon button">
                                    <img style={{width:'16px'}} src={Correo}></img>
                                </button>
                                    <input  style={{marginLeft: '-5px'}} type="email" placeholder="Correo" value={this.state.email} onChange={(text) => this.setState({email:text.target.value})} required/>
                                </div>
                            </div>
                            <div className={'field ' + this.state.wrongField[1]}>
                                <div style={{width:'auto',marginLeft: '20px'}} className="ui left icon input">        
                                    <button style={{marginLeft: '10px'}} className="ui icon button">
                                    <i ></i> <img style={{width:'15px'}} src={Candado}></img>
                                        </button>
                                    <input  style={{marginLeft: '-5px'}} type="password" placeholder="Contraseña" value={this.state.pass} onChange={(text) => this.setState({pass:text.target.value})} required/>
                                </div>
                            </div>             
                            <div className={'field '}>
                                <div style={{width:'30px',marginLeft: '90px'}} className="ui left icon input">
                                    <button style={{marginLeft: '5px',backgroundColor:'#1CA33C',float:'left',paddingTop:'7px'}} className="ui icon button">
                                        <i></i> <img style={{width:'13px'}} src={Acceso}></img>
                                    </button>
                                   
                                </div> <div style={{float:'center',height:'auto'}} className="ui green submit button" onClick={() => this.validate()}>Acceso</div> 
                            </div>
                            <div closeAccess="field">
                                <div className={'ui negative message ' + (this.state.errorMessage[0] ? '':'hidden')} style={{marginTop:'20px'}}>
                                    <i className="close icon" onClick={() => this.handleErrorMessage(0)}></i>
                                    <div className="header">
                                        Correo
                                    </div>
                                    <p>Revise que sea una dirección de correo válida</p>
                                </div>
                            </div>
                            <div closeAccess="field">
                                <div className={'ui negative message ' + (this.state.errorMessage[1] ? '':'hidden')} style={{marginTop:'20px'}}>
                                    <i className="close icon" onClick={() => this.handleErrorMessage(1)}></i>
                                    <div className="header">
                                        Contraseña
                                    </div>
                                    <div className="ui bulleted list">
                                        <div className="item">La contraseña debe tener de 8 a 16 caracteres</div>
                                        <div className="item">Contener al menos una letra Mayúscula</div>
                                        <div className="item">Contener al menos una letra Minúscula</div>
                                        <div className="item">Contener al menos un caracter especial !@#$%&amp;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}