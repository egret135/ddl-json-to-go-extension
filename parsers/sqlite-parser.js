// SQLite DDL Parser
// Parses SQLite CREATE TABLE statements and extracts field information

function parseSQLiteDDL(ddl) {
    const result = {
        tableName: '',
        fields: [],
        error: null
    };

    try {
        // Extract table name
        const tableNameMatch = ddl.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?'?"?(\w+)'?"?/i);
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

            // Parse field: name type [constraints]
            const fieldMatch = line.match(/^'?"?(\w+)'?"?\s+(\w+)\s*(.*)/i);
            if (!fieldMatch) continue;

            const fieldName = fieldMatch[1];
            const fieldType = fieldMatch[2];
            const constraints = fieldMatch[3] || '';

            // SQLite doesn't have inline comments, use field name as comment
            const comment = fieldName;

            // Check if nullable (SQLite allows NULL by default)
            const nullable = !/NOT\s+NULL/i.test(constraints);

            // Check if primary key
            const isPrimaryKey = /PRIMARY\s+KEY/i.test(constraints);

            // Check if autoincrement
            const isAutoIncrement = /AUTOINCREMENT/i.test(constraints);

            // Map SQLite type to Go type
            const goType = mapSQLiteTypeToGo(fieldType);

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

// Map SQLite types to Go types
// SQLite has dynamic typing, but we map based on type affinity
function mapSQLiteTypeToGo(sqliteType) {
    const type = sqliteType.toUpperCase();

    // INTEGER affinity
    if (type.match(/INT/)) {
        return 'int64';
    }

    // TEXT affinity
    if (type.match(/CHAR|CLOB|TEXT/)) {
        return 'string';
    }

    // BLOB affinity
    if (type.match(/BLOB/)) {
        return '[]byte';
    }

    // REAL affinity
    if (type.match(/REAL|FLOA|DOUB/)) {
        return 'float64';
    }

    // NUMERIC affinity (could be int or float, default to float64)
    if (type.match(/NUMERIC|DECIMAL|BOOLEAN|DATE|DATETIME/)) {
        return 'float64';
    }

    // Default to string (SQLite's default type)
    return 'string';
}

// Convert snake_case to CamelCase
function snakeToCamel(str) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    ).replace(/^[a-z]/, (char) => char.toUpperCase());
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseSQLiteDDL, mapSQLiteTypeToGo };
}
