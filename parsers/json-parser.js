// JSON Parser
// Parses JSON and infers Go struct fields

function parseJSON(jsonStr, structName = 'Response') {
    const result = {
        structName: structName,
        fields: [],
        nestedStructs: [],
        error: null
    };

    try {
        const jsonObj = JSON.parse(jsonStr);

        if (typeof jsonObj !== 'object' || jsonObj === null) {
            throw new Error('JSON 必须是一个对象');
        }

        // Parse top-level fields
        result.fields = parseObjectFields(jsonObj, structName, result.nestedStructs);

    } catch (error) {
        result.error = error.message;
    }

    return result;
}

// Parse fields from a JSON object
function parseObjectFields(obj, parentName, nestedStructs) {
    const fields = [];

    for (const [key, value] of Object.entries(obj)) {
        const fieldType = inferType(value);
        const goFieldName = snakeToCamel(key);

        let goType = fieldType;

        // Handle nested objects
        if (fieldType === 'object' && value !== null) {
            const nestedStructName = goFieldName;
            const nestedFields = parseObjectFields(value, nestedStructName, nestedStructs);

            nestedStructs.push({
                name: nestedStructName,
                fields: nestedFields
            });

            goType = nestedStructName;
        }

        // Handle arrays
        if (fieldType === 'array' && Array.isArray(value) && value.length > 0) {
            const elementType = inferType(value[0]);

            if (elementType === 'object' && value[0] !== null) {
                const nestedStructName = goFieldName + 'Item';
                const nestedFields = parseObjectFields(value[0], nestedStructName, nestedStructs);

                nestedStructs.push({
                    name: nestedStructName,
                    fields: nestedFields
                });

                goType = `[]${nestedStructName}`;
            } else {
                goType = `[]${mapJSONTypeToGo(elementType)}`;
            }
        } else if (fieldType === 'array') {
            goType = '[]interface{}';
        }

        fields.push({
            name: key,
            goName: goFieldName,
            type: fieldType,
            goType: mapJSONTypeToGo(goType),
            nullable: value === null,
            isPrimaryKey: false,
            isAutoIncrement: false,
            // No comment field for JSON - this prevents "// fieldname" comments
            jsonName: key,
            dbColumn: key
        });
    }

    return fields;
}


// Infer type from JSON value
function inferType(value) {
    if (value === null) {
        return 'null';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    const type = typeof value;

    if (type === 'number') {
        return Number.isInteger(value) ? 'int' : 'float';
    }

    return type; // 'string', 'boolean', 'object'
}

// Map JSON type to Go type
function mapJSONTypeToGo(jsonType) {
    switch (jsonType) {
        case 'string':
            return 'string';
        case 'int':
            return 'int';
        case 'float':
        case 'number':
            return 'float64';
        case 'boolean':
            return 'bool';
        case 'null':
            return 'interface{}';
        default:
            return jsonType; // For custom types like nested structs
    }
}

// Convert snake_case or kebab-case to CamelCase
function snakeToCamel(str) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    ).replace(/^[a-z]/, (char) => char.toUpperCase());
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseJSON, inferType, mapJSONTypeToGo };
}
