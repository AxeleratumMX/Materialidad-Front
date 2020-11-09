import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconMenu from '../assets/meenu.svg'
import { Link } from 'react-router-dom';
import SeeIcon from '../assets/ico-ver.svg'
import Notify from '@material-ui/icons/Notifications';
import HistoryIcon from '../assets/ico-history.svg'
import CorreoIcon from '../assets/ico-mail.svg'
import Edit from '../assets/ico_edit.svg'
import Doc from '../assets/ico_doc.svg'
import Fade from '@material-ui/core/Fade';

export default function FadeMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        <img src={IconMenu} style={{width:'25px'}} />
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        
          <Link to={{pathname: `/contracts`
                          }}><MenuItem onClick={handleClose}><img src={SeeIcon} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Contratos</MenuItem></Link>
          <Link to={{pathname: `/history`
                          }}><MenuItem onClick={handleClose}><img src={HistoryIcon} style={{width:'15px',margin:'1rem'}} alt='' />
                          Historial</MenuItem></Link>
          <Link to={{pathname: `/alarm`
                          }}><MenuItem onClick={handleClose}>
            <Notify style={{color: 'red', fontSize: 15, margin: '1rem'}} />Alarmas
                          </MenuItem></Link>
          <Link to={{pathname: `/notify`
                          }}><MenuItem onClick={handleClose}><img src={CorreoIcon} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Notificaciones Revisor</MenuItem></Link>
          <Link to={{pathname: `/notifyReviewer`
                          }}><MenuItem onClick={handleClose}><img src={CorreoIcon} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Notificaciones Creador</MenuItem></Link>
          <Link to={{pathname: `/notifySignatory`
                          }}><MenuItem onClick={handleClose}><img src={CorreoIcon} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Notificaciones Firmante</MenuItem></Link>
          <Link to={{pathname: `/notifyFirm`
                          }}><MenuItem onClick={handleClose}><img src={CorreoIcon} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Notificaciones Activar</MenuItem></Link>
          <Link to={{pathname: `/parameter`
                          }}><MenuItem onClick={handleClose}><img src={Edit} style={{width:'15px',margin:'1rem'}} alt=''/>
                          Parametros</MenuItem></Link>
          <Link to={{pathname: `/templates`
          }}><MenuItem onClick={handleClose}><img src={Doc} style={{width:'15px',margin:'1rem'}} alt=''/>
              Plantillas</MenuItem></Link>
              <Link to={{pathname: `/user`
          }}><MenuItem onClick={handleClose}><img src={Doc} style={{width:'15px',margin:'1rem'}} alt=''/>
              Gestión Usuarios</MenuItem></Link>
                           
      </Menu>
    </div>
  );
}
