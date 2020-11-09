import Axios from 'axios';
import _ from 'lodash';
import DocumentsApi from './DocumentsApi';

export default class TemplatesApi {
    static URL = '/api/v1/dynamicinterface/templates';
    static ASSET = '/api/v1/admin/sitio/client/';

    static async create(type) {
        return await Axios.get(this.URL + '/type/' + this._mapType(type))
            .then((response) => response.data);
    }

    static async save(template) {
        return await Axios.put(this.URL, _.cloneDeep(template))
            .then((response) => response.data);
    }

    static async findAllByClient(clientId) {
        return await Axios.get(this.URL + '/client/' + clientId)
            .then((response) => response.data);
    }

    static async findAssetByClient(clientId) {
        return await Axios.get(this.ASSET + clientId)
            .then((response) => response.data);
    }

    static async find(id) {
        return await Axios.get(this.URL + '/' + id)
            .then((response) => response.data);
    }

    static _mapType(type) {
        switch (type) {
        case 'HABITACIONAL': return 'habitacional';
        case 'COMERCIAL': return 'comercial';
        default: throw new Error('TemplatesApi - mapType: invalid type '+type);
        }
    }

    static savePdf(templateId) {
        this.find(templateId).then((template) =>
            DocumentsApi.buildPdf(template, template.name).save(),
        );
    }

    static async findAllPaged(size, page, sortedBy, order) {
        const sortColumn = sortedBy ? sortedBy : 'lastModifiedDate';
        const sortType = order ? order : 'desc';

        const params = {
            size: size,
            page: page,
            sort: ''+sortColumn+','+sortType,
        };

        return await Axios.get(this.URL, {params})
            .then((response) => response.data);
    }


}
