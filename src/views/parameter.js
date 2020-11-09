import React, {Component} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Close from '../assets/ico_close.svg';
import Edit from '../assets/ico_edit.svg';
import '../styles/generador.css';

export default class Parameter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            data: [],
            perPage: 10,
            currentPage: 0,
            search: null,
            filter: '',
            render: true,
            modalAdd: false,
            modalEdit: false,
            valor: '',
            tipo: '',
            descripcion: '',
            tempData: [],
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }


    componentDidMount() {
        this.receivedData();
    }


  handlePageClick = (e) => {
      const selectedPage = e.selected;
      const offset = selectedPage * this.state.perPage;

      this.setState({
          currentPage: selectedPage,
          offset: offset,
      }, () => {
          this.receivedData();
      });
  };

  receivedData() {
      const style = {
          container: {
              height: 'auto',
              width: '95%',
              marginTop: '50px',
              backgroundColor: 'white',
          }, title: {
              textAlign: 'center ',
              margin: '2px', padding: '5px 5px', paddingTop: '20px',
              fontSize: '11pt',
          }, text: {
              color: '#838d93 ', padding: '8px',
              fontSize: '9pt', textAlign: 'center',
          },
      };

      axios
          .get('/api/v1/contracts/tower')
          .then((res) => {
              const data = res.data;
              this.setState({data: data});

              console.log('axios', data.content);
              const slice = data.content.slice(this.state.offset, this.state.offset + this.state.perPage);

              const postData = slice.map((pd) =>
                  // eslint-disable-next-line react/jsx-key
                  <React.Fragment>

                      <tr>
                          <td style={style.text}>{pd.assetId}</td>
                          <td style={style.text}>{pd.tipoContrato}</td>
                          <td style={style.text}>{' '}</td>
                          <td style={style.text}>{' '}</td>
                          <td style={style.text}>{' '}</td>
                          <td style={style.text}>{' '}</td>
                          <td style={style.text}>{pd.subTipoContrato}</td>
                          <td style={style.text}>{pd.folio}</td>
                          <td style={style.text}>
                              <Link to={{
                                  pathname: ``,
                              }}>
                                  <i><img onClick={() => this.openModalEdit(pd)} className='customIcon' src={Edit}></img></i>
                              </Link>
                          </td>
                      </tr>


                  </React.Fragment>);

              this.setState({
                  pageCount: Math.ceil(data.content.length / this.state.perPage),

                  postData,
              });
          });
  }


  render() {
      console.log(this.state);
      const style = {
          container: {
              height: 'auto',
              width: '95%',
              marginTop: '50px',
              backgroundColor: 'white',
          }, title: {
              textAlign: 'center ',
              margin: '2px', padding: '5px 5px', paddingTop: '20px',
              fontSize: '11pt',
          }, text: {
              color: '#838d93 ', padding: '8px',
              fontSize: '9pt', textAlign: 'center',
          },
      };
      return (

          <div className="bodyContainer">

              <div style={{display: 'flex', paddingLeft: '3rem', paddingTop: '2rem', marginTop: '10px'}}>
                  <label style={{fontSize: '20pt'}}>Parámetros</label>
              </div>
              <div style={style.container} className="ui container">
                  <div style={{textAlign: 'center', paddingTop: '20px'}}>
                      <div style={{float: 'left', marginLeft: '20px'}}>

                          <button onClick={() => this.openModalAdd()} style={{float: 'left'}} className="ui green icon left labeled button">
                              <i className="large white icon plus"></i>
                                                Agregar Parámetros
                          </button>

                      </div>
                      <div style={{float: 'left', marginLeft: '20px'}}>
                          <button style={{width: '220px', backgroundColor: 'white', border: '4px', borderRadius: ' 4px', border: '1px solid #E1E3E2'}}
                              className="ui  icon right labeled button dropdown button" >
                              <i className="filter icon"></i>
                              <span className="text">Sort by...</span>
                              <div className={'menu ' + (this.state.activeDrop ? 'transition visible' : '')} >
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
                          </button>
                      </div>
                      <div style={{float: 'right', marginRight: '15px', width: 'auto'}}>
                          <div>
                              <div className="right floated column">
                                  <div className="ui action input">
                                      <input style={{width: 'auto', fontFamily: 'Montserrat, medium '}} type="text" id='filter' name='filter' value={this.state.filter} onChange={this.upddateFilter} placeholder="Search..." />
                                      <button className="ui icon button">
                                          <i className="search icon"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="divider"></div>
                  <table className="ui striped table" >
                      <thead>
                          <tr>
                              <th style={style.title}>Codigo</th>
                              <th style={style.title}>Descripción</th>
                              <th style={style.title}>{' '}</th>
                              <th style={style.title}>{' '}</th>
                              <th style={style.title}>{' '}</th>
                              <th style={style.title}>{' '}</th>
                              <th style={style.title}>Tipo</th>
                              <th style={style.title}>Valor</th>
                              <th style={style.title}>Editar</th>
                          </tr>
                      </thead>
                      <tbody>

                          {this.state.postData}

                      </tbody>
                  </table>
                  <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={this.state.pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}/>
              </div>
              {this.modalAdd()}
              {this.modalEdit()}
          </div>
      );
  }

  openModalAdd() {
      this.setState({modalAdd: true,
      });
  }
  openModalEdit(data) {
      console.log('open1', data);
      this.setState({modalEdit: true,
          tempData: data,
      });
  }


  handleCloseModalAdd() {
      this.setState({modalAdd: false});
  };

  handleCloseModalEdit() {
      this.setState({modalEdit: false});
  };

  onChange(e) {
      this.setState({
          [e.target.name]: e.target.value,
      });
  }

  modalAdd() {
      const style = {
          configSelect: {
              background: 'white',
              border: '1px solid #aaa',
              borderRadius: '5px',
              fontSize: '14px',
              height: '28px',
              padding: '5px',
              width: '95%', marginLeft: '-2px', color: '#838d93',
          },
          configInput: {
              background: '#A1A19B',
              border: '1px solid #aaa',
              borderRadius: '5px',
              fontSize: '14px',
              height: '28px',
              padding: '5px',
              width: '95%', marginLeft: '-2px', color: '#838d93',
          },
      };
      return (
          <React.Fragment>

              <Dialog
                  fullWidth='sm'
                  maxWidth='sm'
                  open={this.state.modalAdd}
                  onClose={() => this.
                      handleCloseModalAdd()}
              >
                  <DialogTitle >
                      <div style={{paddingBottom: '1px'}} className="row">
                          <div style={{paddingLeft: '35rem'}}>
                              <Button onClick={() => this.handleCloseModalAdd()} color="secondary">
                                  <img style={{width: '20px'}} src={Close}></img>
                              </Button>
                          </div>
                      </div>
                  </DialogTitle>
                  <DialogContent>
                      <DialogContentText >
                          <div style={{paddingBottom: '10px'}}>
                              <span style={{marginLeft: '25px', color: '#59666e', fontSize: '1'}}>Agregar parámetro</span>
                          </div>
                      </DialogContentText>

                      <div style={{paddingLeft: '2rem', paddingTop: '10px'}} className="ui grid">

                          <div id='inputs' style={{paddingBottom: '10px'}}>
                              <div style={{float: 'left', width: '8%', paddingRight: '5px'}}>
                                  <label>ID</label>
                                  <input disabled style={style.configInput} type='text' value={'1'}></input>
                              </div>
                              <div style={{float: 'left', width: '38%'}}>
                                  <label>Descripcion</label>
                                  <input name="descripcion" style={style.configSelect} type='text' onChange={this.onChange.bind(this)} value={this.state.descripcion}></input>
                              </div>
                              <div style={{float: 'left', width: '37%', paddingRight: '5px'}}>
                                  <label>Tipo</label>
                                  <select id="tipo" style={style.configSelect}
                                      value={this.state.typeContract}
                                      name="tipo"
                                      onChange={this.onChange.bind(this)} className="item" >
                                      <option className="item" disabled selected>Seleccione una opcion</option>
                                      <option className="item" value='1'>Numérico</option>
                                      <option className="item" value='2'>String</option>
                                      <option className="item" value='3'>Money</option>
                                      <option className="item" value='4'>Fecha</option>
                                  </select>
                              </div>
                              <div style={{float: 'left', width: '17%'}}>
                                  <label>Valor</label>
                                  <input name="valor" style={style.configSelect} type='text' onChange={this.onChange.bind(this)} value={this.state.valor}></input>
                              </div>
                          </div>
                      </div>
                  </DialogContent>
                  <DialogActions>


                      <div style={{float: 'left', width: '50%', paddingLeft: '9rem'}}>
                          <button style={{height: '30px', textAlign: 'justify'}} className="ui green icon left labeled button">
                              <i className=" white icon check"></i>
                                                    Guardar
                          </button>
                      </div>
                  </DialogActions>
              </Dialog>

          </React.Fragment>

      );
  };

  modalEdit() {
      const {tempData}= this.state;
      console.log('modal data', tempData);
      const style = {
          configSelect: {
              background: 'white',
              border: '1px solid #aaa',
              borderRadius: '5px',
              fontSize: '14px',
              height: '28px',
              padding: '5px',
              width: '95%', marginLeft: '-2px', color: '#838d93',
          },
          configInput: {
              background: '#A1A19B',
              border: '1px solid #aaa',
              borderRadius: '5px',
              fontSize: '14px',
              height: '28px',
              padding: '5px',
              width: '95%', marginLeft: '-2px', color: '#838d93',
          },
      };
      return (
          <React.Fragment>

              <Dialog
                  fullWidth='sm'
                  maxWidth='sm'
                  open={this.state.modalEdit}
                  onClose={() => this.
                      handleCloseModalEdit()}
              >
                  <DialogTitle >
                      <div style={{paddingBottom: '1px'}} className="row">
                          <div style={{paddingLeft: '35rem'}}>
                              <Button onClick={() => this.handleCloseModalEdit()} color="secondary">
                                  <img style={{width: '20px'}} src={Close}></img>
                              </Button>
                          </div>
                      </div>
                  </DialogTitle>
                  <DialogContent>
                      <DialogContentText >
                          <div style={{paddingBottom: '10px'}}>
                              <span style={{marginLeft: '25px', color: '#59666e', fontSize: '1'}}>Agregar parámetro</span>
                          </div>
                      </DialogContentText>

                      <div style={{paddingLeft: '2rem', paddingTop: '10px'}} className="ui grid">

                          <div id='inputs' style={{paddingBottom: '10px'}}>
                              <div style={{float: 'left', width: '8%', paddingRight: '5px'}}>
                                  <label>ID</label>
                                  <input disabled style={style.configInput} type='text' value={'1'}></input>
                              </div>
                              <div style={{float: 'left', width: '38%'}}>
                                  <label>Descripcion</label>

                                  <input name="descripcion" style={style.configSelect} type='text' onChange={this.onChange.bind(this)} value={tempData.subTipoContrato}></input>
                              </div>
                              <div style={{float: 'left', width: '37%', paddingRight: '5px'}}>
                                  <label>Tipo</label>
                                  <select id="tipo" style={style.configSelect}
                                      value={this.state.typeContract}
                                      name="tipo"
                                      onChange={this.onChange.bind(this)} className="item" >
                                      <option className="item" disabled selected>Seleccione una opcion</option>
                                      <option className="item" value='1'>Numérico</option>
                                      <option className="item" value='2'>String</option>
                                      <option className="item" value='3'>Money</option>
                                      <option className="item" value='4'>Fecha</option>
                                  </select>
                              </div>
                              <div style={{float: 'left', width: '17%'}}>
                                  <label>Valor</label>
                                  <input name="valor" style={style.configSelect} type='text' onChange={this.onChange.bind(this)} value={tempData.assetId}></input>
                              </div>
                          </div>
                      </div>
                  </DialogContent>
                  <DialogActions>


                      <div style={{float: 'left', width: '50%', paddingLeft: '9rem'}}>
                          <button style={{height: '30px', textAlign: 'justify'}} className="ui green icon left labeled button">
                              <i className=" white icon check"></i>
                                                        Guardar
                          </button>
                      </div>
                  </DialogActions>
              </Dialog>

          </React.Fragment>

      );
  };
}
