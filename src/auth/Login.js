import React from 'react';
import Logo from '../images/logo-cibanco-vector.svg';
import AuthApi from './AuthApi';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

const Login = (props) => {
    const [username, setUsername] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(null);

    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(null);

    const [unauthorized, setUnauthorized] = React.useState(false);

    const [touched, setTouched] = React.useState(false);


    const style = {
        container: {
            width: '30%',
            minWidth: '400px',
            margin: '0 auto',
            display: 'block',
            position: 'relative',
            top: '25%',
            overflow: 'auto',
        },
        logo: {
            width: '70%',
            margin: '0 auto',
            display: 'block',
            position: 'relative',
            marginBottom: '30px',
        },
        icon: {
            color: '#f10000',
            margin: '6px 5px',
            position: 'relative',
            right: 35,
            zIndex: 999,
        },
    };

    const validate = () => {
        let isValid = true;

        if (username === null || username === undefined || username === '' || username.length < 3) {
            setUsernameError('El usuario es requerido y debe ser mayor a 3 caracteres');
            isValid = false;
        }

        if (password === null || password === undefined || password === '' || password.length < 8) {
            setPasswordError('La contraseña es requerida y debe ser mayor a 8 caracteres');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (validate()) {
            AuthApi.login(username, password)
                .then(() => props.history.push('/'))
                .catch((error) => {
                    if (error.response.status === 401) setUnauthorized(true);
                });
        }

        setTouched(true);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setUsernameError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(null);
    };

    React.useEffect(() => {
        AuthApi.logout();
    }, []);


    return (
        <div className="bodyContainer" style={{overflowY: 'auto'}}>
            <div className="ui segment" style={style.container}>
                <img src={Logo} style={style.logo} alt="American Tower"/>
                <div className="ui large form error">
                    <div className="ui stacked segment">
                        <div>
                            <div className="ui left icon input" style={{width: '100%'}}>
                                <i className="user icon"/>
                                <input type="text"
                                    placeholder="Usuario"
                                    maxLength={50}
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                />
                                {touched && !!usernameError ? <Tooltip arrow title={usernameError}>
                                    <ReportProblemOutlinedIcon style={style.icon}/>
                                </Tooltip> : null}
                            </div>
                        </div>

                        <div style={{marginTop: '7px'}}>
                            <div className="ui left icon input" style={{width: '100%'}}>
                                <i className="lock icon"/>
                                <input type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    maxLength={40}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                {touched && !!passwordError ? <Tooltip arrow title={passwordError}>
                                    <ReportProblemOutlinedIcon style={style.icon}/>
                                </Tooltip> : null}
                            </div>
                        </div>


                        {unauthorized ? <div>
                            <div className="ui negative message" style={{marginTop: '20px'}}>
                                <i className="close icon" onClick={() => setUnauthorized(false)}/>
                                <div className="header">Error</div>
                                <p>Usuario o contraseña incorrecto</p>
                            </div>
                        </div> : null}

                        <button className="ui fluid primary submit button"
                            style={{marginTop: '20px',backgroundColor:'#007836'}}
                            type="submit"
                            id="loginBtn"
                            onClick={handleLogin}
                        >Ingresar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    history: PropTypes.object,
};

export default Login;
