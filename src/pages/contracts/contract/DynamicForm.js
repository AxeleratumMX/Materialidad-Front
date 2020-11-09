import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import DynamicInput from './DynamicInput';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';

const DynamicForm = (props) => {
    const [values, setValues] = React.useState([]);
    const [sectionId, setSectionId] = React.useState(null);
    const [touched, setTouched] = React.useState(false);

    React.useEffect(() => {
        if (sectionId !== props.sectionId) {
            setTouched(false);
        }

        setSectionId(props.sectionId);
        setValues(_.cloneDeep(props.values));
    }, [props.sectionId, props.values]);

    const cleanDependencies = (value, nextValues) => {
        const dependencies = nextValues
            .filter(((nv) =>
                !isEmpty(nv.content) &&
                nv.operation &&
                nv.operation.params.findIndex((p) => p.value === value.id) >= 0));

        dependencies.forEach((dep) => {
            const depIndex = nextValues.findIndex((nv) => nv.id === dep.id);
            nextValues[depIndex] = {...nextValues[depIndex], content: ''};
            cleanDependencies(nextValues[depIndex], nextValues); //recursive
        });
    };

    const handleChange = (event, prevValue) => {
        const nextValues = [...values];
        const index = values.findIndex((value) => value.id === prevValue.id);
        const content = event.target.type === 'checkbox' ? event.target.checked.toString() : event.target.value;

        if (isEmpty(content)) {
            cleanDependencies(prevValue, nextValues);
        }

        nextValues[index] = {...nextValues[index], content};
        setValues(nextValues);
    };

    const isEmpty = (text) => text === null || text === undefined || text === '';

    const handleBlur = (event, prevValue) => {
        if (event.target.type === 'checkbox') return;

        const content = event.target.value;
        if (!isEmpty(content) && !isEmpty(prevValue.regex) && !new RegExp(prevValue.regex).test(content)) {
            const nextValues = [...values];
            const index = values.findIndex((value) => value.id === prevValue.id);
            nextValues[index] = {...nextValues[index], content: ''};
            setValues(nextValues);
        }
    };

    const style = {
        submit: {
            marginTop: '20px',
            marginBottom: '20px',
            position: 'absolute',
            right: '0',
            bottom: '0',
        },
        title: {
            color: '#59666e',
            marginBottom: '30px',
        },
    };

    const getValidation = (value) => {
        if (props.validations && props.validations.length > 0) {
            return props.validations.find((v) => v.id === value.id);
        }
        return null;
    };

    const handleSave = (e) => {
        if (e) e.preventDefault();
        props.save(values);
        setTouched(true);
    };

    const handleCalculate = (e) => {
        if (e) e.preventDefault();
        props.calculate(values);
        setTouched(true);
    };

    const handleSaveAndNext = (e) => {
        if (e) e.preventDefault();
        props.saveAndNext(values);
        setTouched(true);
    };


    const hasEmptyListValue = (contents, valueId) => {
        return Array.isArray(contents) && contents.some((content) => isEmpty(content[valueId]));
    };

    const hasEmptyDependency = (value) => {
        return value && value.operation && value.operation.params
            .map((param) => values.find((v) => v.id === param.value))
            .filter((v) => !!v)
            .some((v) => {
                const section = props.sections.find((section) => v.sectionId === section.id);
                return section.type === 'list' ?
                    hasEmptyListValue(section.content, v.id) : isEmpty(v.content);
            });
    };

    const handleKeyPressed = (event) => {
        if (event.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <Container>
            <h3 style={style.title}>{props.title}</h3>

            <form>
                {<Grid container spacing={2} onKeyPress={handleKeyPressed}>
                    {values.map((value) => (
                        <Grid item sm={5} md={3} key={value.id}>
                            <DynamicInput
                                {...value}
                                validation={getValidation(value)}
                                value={value.content}
                                touched={touched}
                                onBlur={(e) => handleBlur(e, value)}
                                label={value.description ? value.description : value.id}
                                onChange={(e) => handleChange(e, value)}
                                editable={value.editable && props.editable && !hasEmptyDependency(value)}
                                loading={props.loading}
                            />
                        </Grid>
                    ))}
                </Grid>}

                <div style={style.submit}>
                    {props.calculate &&
                    <button onClick={handleCalculate}
                        disabled={!props.editable}
                        style={{marginRight: '30px'}}
                        className="ui icon violet left labeled button">
                        <i className="white icon calculator "/>
                        Calcular
                    </button>}

                    {props.saveAndNext &&
                    <Tooltip title="Guardar y Continuar" arrow placement="top">
                        <span>
                            <button onClick={handleSaveAndNext}
                                disabled={!props.editable}
                                style={{marginRight: '30px'}}
                                className="ui blue icon left labeled button">
                                <i className="white icon play"/>
                                Siguiente
                            </button>
                        </span>
                    </Tooltip>}

                    <Tooltip title="Guardar y Cerrar" arrow placement="top">
                        <span>
                            <button onClick={handleSave}
                                disabled={!props.editable}
                                style={{marginRight: '30px'}}
                                className="ui green icon left labeled button">
                                <i className="white icon check"/>
                            Guardar
                            </button>
                        </span>
                    </Tooltip>

                </div>
            </form>
        </Container>
    );
};

DynamicForm.propTypes = {
    calculate: PropTypes.func,
    values: PropTypes.array,
    sections: PropTypes.array,
    validations: PropTypes.array,
    title: PropTypes.string,
    sectionId: PropTypes.string,
    save: PropTypes.func,
    saveAndNext: PropTypes.func,
    editable: PropTypes.bool,
    loading: PropTypes.bool,
};

export default DynamicForm;
