import _ from 'lodash';

export default class ContractsUtil {
    static DRAFT_STATUS = 'BORRADOR'
    static REVISION_STATUS = 'REVISION'

    static filterValidationErrors(validations) {
        return validations.filter((v) => v.operationErrors && v.operationErrors.length > 0);
    }

    /* This method evaluates if a section is valid.
     * It returns an array of booleans. If the section is a list, each value indicates if the item for that index is
     * valid, otherwise the array will have a only one value, indicating if the section is valid */
    static buildSectionValidationsArray(section, sectionValues) {
        const validation = [];
        if (section.type === 'list') {
            if (Array.isArray(section.content)) {
                section.content.forEach((item) => {
                    validation.push(Object.entries(item).findIndex(([id, value]) => {
                        const contractValue = sectionValues.find((v) => v.id === id);
                        return this.isInvalidValue(value, contractValue ? contractValue.optional : true);
                    }) < 0);
                });
            }
        } else {
            const hasError = this.filterValidationErrors(sectionValues).length > 0;
            validation.push(sectionValues.findIndex((v) => this.isInvalidValue(v.content, v.optional)) < 0 || hasError);
        }

        return validation;
    }

    static isInvalidValue(value, optional) {
        return (value === null || value === undefined || value === '') && optional === false;
    }

    static buildValidations(contract) {
        let hasIncompleteSection = false;
        contract.templateInstance.sections.forEach((section) => {
            const sectionValues = contract.templateInstance.values.filter((v) => v.sectionId === section.id);
            section._validations = this.buildSectionValidationsArray(section, sectionValues);
            if (!Array.isArray(section._validations) || section.length === 0 || section._validations.includes(false)) {
                hasIncompleteSection = true;
            }
        });

        return hasIncompleteSection;
    }

    static getSectionValues(values, section, index) {
        let sectionValues = _.cloneDeep(values.filter((value) => value.sectionId === section.id));

        if (section.type === 'list') {
            // this is added to have a name for the list item, which is shown in the side menu
            sectionValues = [{
                id: 'id',
                sectionId: section.id,
                description: 'Nombre',
                dataType: 'string',
                content: '',
                editable: true,
                optional: false,
            }, ...sectionValues];

            // mapping value with content, which is inside the section
            if (index !== undefined && section.content && section.content[index]) {
                const valueItem = section.content[index];
                sectionValues.forEach((v) => {
                    const value = valueItem[v.id];
                    v.content = value === null || value === undefined ? null : value.toString();
                });
            }
        }

        return sectionValues;
    }

    static getNextSection(prevSection, index, sections) {
        if (prevSection.type === 'list') {
            if (Array.isArray(prevSection.content) && (index + 1) < prevSection.content.length) {
                return {section: prevSection, index: index + 1}; // next list item
            } else { // not list items remaining
                return {section: prevSection}; // new list item
            }
        } else {
            const sectionIndex = sections.findIndex((s) => s.id === prevSection.id);

            if ((sectionIndex + 1) < sections.length) { // there is another section
                const nextSection = sections[sectionIndex + 1]; // next section
                if (nextSection.type === 'list') {
                    return {section: nextSection, index: 0};
                }
                return {section: nextSection};
            } else { // no sections remaining
                return {section: null, index: null}; // close section dialog
            }
        }
    }

    static isOkForRevision(contract) {
        return contract.templateInstance.sections.findIndex((s) => s._validations.includes(false)) < 0 ||
            this.filterValidationErrors(contract.templateInstance.values).length > 0;
    }


    static getRequiredValidationMessage(value, sections) {
        const section = sections.find((s) => s.id === value.sectionId);
        if (section.type === 'value') {
            return this.isInvalidValue(value.content, value.optional) ?
                `El campo "${value.description}" es requerido` : '';
        }

        return '';
    };

    static getValidationMessage(contract) {
        return contract.templateInstance.values
            .map((v) => v.operationErrors.length > 0 ?
                v.operationErrors.join('. ') : this.getRequiredValidationMessage(v, contract.templateInstance.sections))
            .reduce((sum, value) => value !== '' ? sum + (sum !== '' ? '. ' : '') + value : sum);
    };
}
