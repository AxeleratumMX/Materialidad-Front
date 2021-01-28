import html2pdf from 'html2pdf.js';
import Mustache from 'mustache';

export default class DocumentsApi {
    static _pdfOptions(fileName) {
        return {
            margin: 1,
            filename: fileName && fileName !== '' ? fileName + '.pdf' : 'Document.pdf',
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2,imageTimeout: 0},
            jsPDF: {unit: 'in', format: 'a4', orientation: 'portrait',compress:true},
            pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
        };
    }

    static buildPdf(template, fileName) {
        console.log("data pdf",fileName)
        console.log("data template",template)

        const html = this.buildHtml(template);
        return html2pdf().from(html).set(this._pdfOptions("CibancoFideicomiso2_"+template.name));
    }

    static buildMultiplePdf(templates, fileName) {
        const pages = templates.map((template) => this.buildHtml(template));
        const options = this._pdfOptions(fileName);
        // build the document template by template because all at once fails
        let worker = html2pdf().from(pages[0]).set(options).toPdf();
        pages.slice(1).forEach((page) => {
            worker = worker.get('pdf').then((pdf) => {
                pdf.addPage();
            }).from(page).toContainer().toCanvas().toPdf();
        });
        return worker;
    }

    static _itemToString(id, content, sectionId, values, preview) {
        const contractValue = values.find((v) => v.id === id && v.sectionId === sectionId);
        return this._toString({...contractValue, content: content}, preview);
    }

    static _buildSectionList(section, template, preview) {
        return section.content.map((c) =>
            // deconstructing object into a list to get the attribute names
            Object.entries(c).reduce((obj, [attrName, attrValue]) =>
                // reconstructing object, but changing its values
                Object.assign(obj, {
                    [attrName]: this._itemToString(attrName, attrValue, section.id, template.values, preview),
                }), {},
            ),
        );
    }

    // builds an object from contract values and list sections, so mustache can use it to build the final html
    static _buildMustacheData(template, preview) {
        const listSections = template.sections ? template.sections.filter((s) => s.type === 'list') : null;
        const nonListValues = template.values ? listSections ? template.values.filter((v) =>
            listSections.findIndex((s) => s.id === v.sectionId) < 0) : template.values : null;

        let data = {};

        if (nonListValues) {
            // build non list data
            data = nonListValues.reduce((obj, value) =>
                Object.assign(obj, {[value.id]: this._toString(value, preview)}), {},
            );

            // build list data
            if (listSections) {
                listSections.forEach((section) => {
                    if (Array.isArray(section.content) && section.content.length > 0) {
                        data = {...data, [section.id]: this._buildSectionList(section, template, preview)};
                    }
                });
            }
        }


        return data;
    }

    static buildHtml(template, preview) {
        const data = this._buildMustacheData(template, preview);

        // decode content from base64
        const decodedContent = template.content ? Buffer.from(template.content, 'base64').toString('utf8') : '';

        return Mustache.render(decodedContent, data);
    }

    // return a value with custom format
    static _toString = (value, preview) => {
        // if value is missing, a red description is displayed
        if (value.content === null || value.content === undefined || value.content === '') {
            return `<span style='color: #ee0909'>${value.description}</span>`;
        }

        let text;

        switch (value.dataType) {
        case 'date':
            const format = {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'};
            text = new Date(value.content).toLocaleDateString('es', format);
            break;
        case 'checkbox':
            text = value.content.toString() === 'true' ? 'si' : 'no';
            break;
        default:
            text = value.content;
            break;
        }

        // in the preview, values are shown with css format, but not in the final result
        return preview ? `<span title="${value.description}" style="color: #009823;">${text}</span>` : text;
    }
}
