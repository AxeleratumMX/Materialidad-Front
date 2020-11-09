import Axios from 'axios';

export default class DomainsApi {
    static URL = '/api/v1/catalog/domains/'

    static async findStatus(key) {
        return await Axios.get(this.URL+'STATUS/'+key).then((response) => response.data);
    }

    static async findAllStatuses() {
        return await Axios.get(this.URL+'STATUS').then((response) => response.data);
    }

    static async findAllAbstractTypes() {
        return await Axios.get(this.URL+'ABSTRACT_TYPE').then((response) => response.data);
    }

    static async findAgreement(key) {
        return await Axios.get(this.URL+'ACUERDO/'+key).then((response) => response.data);
    }

    static async findAllAgreements() {
        return await Axios.get(this.URL+'ACUERDO').then((response) => response.data);
    }

    static async findAbstractType(key) {
        return await Axios.get(this.URL+'ABSTRACT_TYPE/'+key).then((response) => response.data);
    }

    static async findLeaseType(key) {
        return await Axios.get(this.URL+'LEASE_TYPE/'+key).then((response) => response.data);
    }

    static async findAllLeaseTypes() {
        return await Axios.get(this.URL+'LEASE_TYPE').then((response) => response.data);
    }

    static async findAllOracleTypes() {
        return await Axios.get(this.URL+'CONTRATO').then((response) => response.data);
    }

    static async findOracleType(key) {
        return await Axios.get(this.URL+'CONTRATO/'+key).then((response) => response.data);
    }

    static async findAllOracleSubTypes(oracleTypeKey) {
        return await Axios.get(this.URL+'SUB_CONTRATO/subdomain/'+oracleTypeKey).then((response) => response.data);
    }

    static async findOracleSubType(oracleSubTypeKey) {
        return await Axios.get(this.URL+'SUB_CONTRATO/'+oracleSubTypeKey).then((response) => response.data);
    }
}
