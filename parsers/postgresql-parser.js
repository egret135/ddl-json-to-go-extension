// PostgreSQL DDL Parser
// Parses PostgreSQL CREATE TABLE statements and extracts field information

function parsePostgreSQLDDL(ddl) {
    const result = {
        tableName: '',
        fields: [],
        error: null
    };

    try {
        // Extract table name
        const tableNameMatch = ddl.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"?(\w+)"?/i);
        if (!tableNameMatch) {
            throw new Error('无法解析表名');
        }
        result.tableName = tableNameMatch[1];

        // Extract fields section (between parentheses)
        const fieldsMatch = ddl.match(/\(([\s\S]+)\)/);
        if (!fieldsMatch) {
            throw new Error('无法解析字段定义');
        }

        const fieldsSection = fieldsMatch[1];

        // Split by lines and parse each field
        const lines = fieldsSection.split(/,\s*\n/).map(line => line.trim());

        for (const line of lines) {
            // Skip constraints
            if (/^(PRIMARY\s+KEY|UNIQUE|CHECK|CONSTRAINT|FOREIGN\s+KEY)/i.test(line)) {
                continue;
            }

            // Parse field: name type [constraints] [comment]
            const fieldMatch = line.match(/^"?(\w+)"?\s+(\w+(?:\([^)]+\))?(?:\[\])?)\s*(.*)/i);
            if (!fieldMatch) continue;

            const fieldName = fieldMatch[1];
            const fieldType = fieldMatch[2];
            const constraints = fieldMatch[3] || '';

            // PostgreSQL doesn't have inline COMMENT, usually uses -- or separate COMMENT ON statements
            // For now, use field name as comment
            const comment = fieldName;

            // Check if nullable
            const nullable = !/NOT\s+NULL/i.test(constraints);

            // Check if primary key
            const isPrimaryKey = /PRIMARY\s+KEY/i.test(constraints);

            // Check if serial (auto increment)
            const isAutoIncrement = /SERIAL|BIGSERIAL|SMALLSERIAL/i.test(fieldType);

            // Map PostgreSQL type to Go type
            const goType = mapPostgreSQLTypeToGo(fieldType);

            // Generate Go field name (snake_case to CamelCase)
            const goFieldName = snakeToCamel(fieldName);

            result.fields.push({
                name: fieldName,
                goName: goFieldName,
                type: fieldType,
                goType: goType,
                nullable: nullable,
                isPrimaryKey: isPrimaryKey,
                isAutoIncrement: isAutoIncrement,
                comment: comment,
                jsonName: fieldName,
                dbColumn: fieldName
            });
        }

    } catch (error) {
        result.error = error.message;
    }

    return result;
}

// Map PostgreSQL types to Go types
function mapPostgreSQLTypeToGo(pgType) {
    const type = pgType.toUpperCase();

    // Boolean
    if (type.match(/^BOOLEAN|BOOL$/)) {
        return 'bool';
    }

    // Integer types
    if (type.match(/^(SMALLINT|INT|INTEGER|BIGINT|SERIAL|BIGSERIAL|SMALLSERIAL)/)) {
        return 'int64';
    }

    // String types
    if (type.match(/^(VARCHAR|CHAR|TEXT|CHARACTER)/)) {
        return 'string';
    }

    // UUID
    if (type.match(/^UUID/)) {
        return 'string';
    }

    // Float types
    if (type.match(/^(REAL|DOUBLE\s+PRECISION|NUMERIC|DECIMAL)/)) {
        return 'float64';
    }

    // Date/Time types
    if (type.match(/^(DATE|TIME|TIMESTAMP|TIMESTAMPTZ)/)) {
        return 'time.Time';
    }

    // JSON types
    if (type.match(/^(JSON|JSONB)/)) {
        return 'json.RawMessage';
    }

    // Binary types
    if (type.match(/^BYTEA/)) {
        return '[]byte';
    }

    // Array types
    if (type.match(/\[\]$/)) {
        const baseType = type.replace(/\[\]$/, '');
        const goBaseType = mapPostgreSQLTypeToGo(baseType);
        return `[]${goBaseType}`;
    }

    // Default to string
    return 'string';
}

// Convert snake_case to CamelCase (same as MySQL parser)
function snakeToCamel(str) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    ).replace(/^[a-z]/, (char) => char.toUpperCase());
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parsePostgreSQLDDL, mapPostgreSQLTypeToGo };
}
