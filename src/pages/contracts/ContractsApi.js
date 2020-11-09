import Axios from 'axios';
import ClientsApi from '../clients/ClientsApi';
import _ from 'lodash';
import DomainsApi from '../domains/DomainsApi';
import DocumentsApi from '../templates/DocumentsApi';

export default class ContractsApi {
    static URL = '/api/v1/dynamicinterface/templates/contract/';
    static VALIDATIONS = '/api/v1/dynamicinterface/contract/validations/rules'
    static pdfName = (id) => `AmericanTowerContract_No-${id}`

    static async find(contractId) {
        return await Axios.get(this.URL + contractId)
            .then((response) => this._mapContract(response.data));
    }

    static async save(contract) {
        return contract.id ? this.persist(contract) : this.create(contract);
    }

    static async create(contract) {
        return await Axios.post(this.URL, this._normalize(contract))
            .then((response) => this._mapContract(response.data));
    }

    static async persist(contract) {
        return await Axios.put(this.URL, this._normalize(contract))
            .then((response) => this._mapContract(response.data));
    }

    static async validate(contract) {
        return await Axios.patch(this.VALIDATIONS+'/all', this._normalize(contract))
            .then((response) => this._mapContract(response.data));
    }

    static async changeStatus(contractId, newStatus) {
        return await Axios.patch(this.URL+`${contractId}/status/${newStatus}`)
            .then((response) => response.data);
    }

    static async findGroup(groupId) {
        const group = (await Axios.get(this.URL + 'groups/' + groupId)).data;
        group._master = await this.find(group.masterContractId);

        if (Array.isArray(group.valuesIds)) {
            group._values = [];
            group.valuesIds.forEach((valueId) => {
                group._values.push(group._master.templateInstance.values.find((value) => value.id === valueId));
            });
        }

        if (Array.isArray(group.contractIds)) {
            group._contracts = new Array(group.contractIds.length).fill(null);
            await Promise.all(group.contractIds.map((contractId, index) =>
                this.find(contractId).then((contract) => group._contracts[index] = contract),
            ));
        }

        return group;
    }


    static saveGroup(group) {
        return group.id ? this.persistGroup(group) : this.createGroup(group);
    }

    static async persistGroup(group) {
        return await Axios.put(this.URL + 'groups', _.cloneDeep(group))
            .then((response) => response.data);
    }

    static async createGroup(group) {
        return await Axios.post(this.URL + 'groups', _.cloneDeep(group))
            .then((response) => response.data);
    }

    static async _mapValues(values) {
        const optionValues = values.filter((v) => v.dataType === 'option');
        return Promise.all(optionValues.map(async (value) => {
            if (value.apiRestListOfValue && value.apiRestListOfValue!=='') {
                const response = await Axios.get(value.apiRestListOfValue);
                value._options = response.data;
            }
        }));
    }

    static async _mapContract(contract) {
        await this._mapValues(contract.templateInstance.values);

        contract.templateInstance._client = await ClientsApi
            .find(contract.templateInstance.clientId)
            .catch((e) => {
                console.log(e);
            });

        contract.templateInstance._status = await DomainsApi
            .findStatus(contract.templateInstance.estado)
            .catch((e) => {
                console.log(e);
            });

        return contract;
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

    static savePdf(contractId) {
        this.find(contractId).then((contract) =>
            DocumentsApi.buildPdf(
                contract.templateInstance,
                this.pdfName(contract.id)).save(),
        );
    }

    static _normalize(_contract, deleteContent = false) {
        const contract = _.cloneDeep(_contract);

        // deleting custom data
        contract.templateInstance.values.forEach((v) => {
            delete v._options;
            v.operationErrors = [];
        });
        contract.templateInstance.sections.forEach((v) => delete v._validations);
        delete contract.templateInstance._client;
        delete contract.templateInstance._status;
        if (deleteContent) delete contract.templateInstance.content;

        return contract;
    }
}
