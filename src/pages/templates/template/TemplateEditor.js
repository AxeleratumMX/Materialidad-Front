import React, {Fragment} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import './TemplateEditor.css';
import PropTypes from 'prop-types';

const TemplateEditor = ({sections, values, ...props}) => {
    const [valuesSuggestions, setValuesSuggestions] = React.useState([]);

    const tagValue = (value) =>
        `<span title="${value.description}" class="mceNonEditable valueTag">{{{${value.id}}}}</span>`;

    const tagSection = (section) =>
        `<p class="mceNonEditable tableTag" style="margin: 0;">
            <span title="${section.description}">{{#${section.id}}}</span>
        </p>
        <p class="mceNonEditable tableTag" style="margin: 0;">
            <span title="${section.description}">{{/${section.id}}}</span>
        </p>`;

    const buildValuesSuggest = () => {
        const suggestions = [];

        // add values suggestions
        values.forEach((value) => {
            const section = sections.find((s) => s.id === value.sectionId);
            const sectionName = section && section.type === 'list' ? ` (${section.description})` : '';

            suggestions.push({
                text: (value.description ? value.description : value.id) + sectionName,
                value: tagValue(value),
            });
        });

        // add 'Nueva Tabla' suggestions
        sections.filter((section) => section.type === 'list').forEach((section) => {
            suggestions.push({
                text: `Nueva Tabla ${section.description}`,
                value: tagSection(section),
            });
        });

        setValuesSuggestions(suggestions);
    };

    React.useEffect(() => {
        buildValuesSuggest();
    }, [values, sections]);

    const onValuesSuggest = (pattern) => {
        const matchedValues = valuesSuggestions.filter((char) =>
            char.text.toLowerCase().indexOf(pattern.toLowerCase()) !== -1,
        );

        return new Promise((resolve) => {
            const results = matchedValues.map((char) => {
                return {
                    value: char.value,
                    text: char.text,
                };
            });
            resolve(results);
        });
    };

    const createNestedMenuItem = (section, editor) => {
        return {
            type: 'nestedmenuitem',
            text: section.description,
            getSubmenuItems: () => {
                const subList = [];

                if (section.type === 'list') {
                    subList.push({
                        type: 'menuitem',
                        text: `(Nueva Tabla)`,
                        onAction: () => editor.insertContent(tagSection(section)),
                    });
                }

                values.filter((v) => v.sectionId === section.id).forEach((value) => subList.push({
                    type: 'menuitem',
                    text: value.description ? value.description : value.id,
                    onAction: () => editor.insertContent(tagValue(value)),
                }));

                return subList;
            },
        };
    };

    const buildValuesComboList = (editor) => {
        const list = [];
        sections.forEach((section) => list.push(createNestedMenuItem(section, editor)));
        return list;
    };

    const editorStyle =`
        .valueTag {
            background-color: #f8d7da; 
            border: 2px solid #f5c6cb; 
            padding: 0 2px 1px 2px; 
            color: #721c24; 
            border-radius: 5px; 
            font-size: 11pt;
        }
        .tableTag {
            margin: 0; 
            padding: 0;
            background-color: #cce5ff; 
            border: 2px solid #b8daff; 
            padding: 0 2px 1px 2px; 
            color: #004085; 
            border-radius: 5px; 
            font-size: 11pt;
        }
    `;

    const init = {
        language: 'es',
        height: '100%',
        branding: false,
        paste_data_images: true,
        table_style_by_css: true,
        pagebreak_separator: '<div style="page-break-before: always;"/>',
        content_style: editorStyle,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen pagebreak',
            'insertdatetime media table paste code help wordcount noneditable',
        ],
        toolbar:
            `valuesSuggestButton | bold italic underline removeformat forecolor | formatselect | 
            alignleft aligncenter alignright alignjustify | 
            bullist numlist outdent indent | undo redo`,
        setup: (editor) => {
            /* An autocompleter that allows you to insert special characters */
            editor.ui.registry.addAutocompleter('valuesSuggestAuto', {
                ch: '+',
                minChars: 0,
                fetch: onValuesSuggest,
                onAction: (autocompleteApi, rng, value) => {
                    editor.selection.setRng(rng);
                    editor.insertContent(value);
                    autocompleteApi.hide();
                },
            });

            editor.ui.registry.addMenuButton('valuesSuggestButton', {
                text: 'Datos',
                onAction: () => {},
                fetch: (callback) => callback(buildValuesComboList(editor)),
            });
        },
    };

    return (
        <Fragment>
            {valuesSuggestions && valuesSuggestions.length > 0 &&
            <Editor style={{border: '1px solid rgba(0, 0, 0, 0.12)'}}
                apiKey="76df0wnini06kzzjgzc5sdvee4tdm032yjwughv5oq7gxnfj"
                init={init}
                {...props}
            />}
        </Fragment>
    );
};

TemplateEditor.propTypes = {
    sections: PropTypes.array,
    values: PropTypes.array,
};

export default TemplateEditor;
