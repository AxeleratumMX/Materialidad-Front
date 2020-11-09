import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Loading from '../../../components/Loading';
import DocumentsApi from '../../templates/DocumentsApi';

// Props.type 'http' draws pdf as http, otherwise a pdf iframe is displayed
const PdfDocument = React.forwardRef((props, ref) => {
    const [pdfSrc, setPdfSrc] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [html, setHtml] = React.useState(false);

    React.useEffect(() => {
        if (props.type === 'pdf') {
            setLoading(true);
            createDocument().outputPdf('datauristring').then((pdf) => {
                setPdfSrc(pdf);
                setLoading(false);
            });
        }
        if (props.type === 'html') {
            setHtml(DocumentsApi.buildHtml(props.template, true));
        }
    }, [props.template, props.type]);

    const createDocument = React.useCallback(() => {
        return DocumentsApi.buildPdf(props.template, props.fileName);
    }, []);

    React.useImperativeHandle(ref, () => ({
        downloadPdf() {
            createDocument().save();
        },
    }));

    return (
        <Fragment>
            {loading && <Loading />}
            {props.type === 'html' ?
                <Paper variant="outlined" square style={{height: '85%', overflowY: 'auto'}}>
                    <div style={{padding: '40px'}}
                        dangerouslySetInnerHTML={{__html: html}}/>
                </Paper> :
                <object width={'100%'} height={'100%'} data={pdfSrc}>
                    Su navegador no soporta este tipo de documento.
                </object>
            }
        </Fragment>
    );
});

PdfDocument.displayName = 'PdfDocument';

PdfDocument.propTypes = {
    template: PropTypes.object,
    fileName: PropTypes.string,
    type: PropTypes.string,
};

export default PdfDocument;
