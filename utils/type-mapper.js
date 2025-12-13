// Type Mapper Utility
// Central place for all database type to Go type mappings

const TypeMapper = {
    // MySQL type mappings
    mysql: {
        'TINYINT(1)': 'bool',
        'TINYINT': 'int64',
        'SMALLINT': 'int64',
        'MEDIUMINT': 'int64',
        'INT': 'int64',
        'INTEGER': 'int64',
        'BIGINT': 'int64',
        'VARCHAR': 'string',
        'CHAR': 'string',
        'TEXT': 'string',
        'TINYTEXT': 'string',
        'MEDIUMTEXT': 'string',
        'LONGTEXT': 'string',
        'FLOAT': 'float64',
        'DOUBLE': 'float64',
        'DECIMAL': 'float64',
        'NUMERIC': 'float64',
        'DATE': 'time.Time',
        'DATETIME': 'time.Time',
        'TIMESTAMP': 'time.Time',
        'TIME': 'time.Time',
        'YEAR': 'int',
        'JSON': 'json.RawMessage',
        'BLOB': '[]byte',
        'BINARY': '[]byte',
        'VARBINARY': '[]byte',
        'ENUM': 'string',
        'SET': 'string'
    },

    // PostgreSQL type mappings
    postgresql: {
        'SMALLINT': 'int64',
        'INTEGER': 'int64',
        'INT': 'int64',
        'BIGINT': 'int64',
        'SERIAL': 'int64',
        'BIGSERIAL': 'int64',
        'SMALLSERIAL': 'int',
        'BOOLEAN': 'bool',
        'BOOL': 'bool',
        'VARCHAR': 'string',
        'CHAR': 'string',
        'CHARACTER': 'string',
        'TEXT': 'string',
        'UUID': 'string',
        'REAL': 'float64',
        'DOUBLE PRECISION': 'float64',
        'NUMERIC': 'float64',
        'DECIMAL': 'float64',
        'DATE': 'time.Time',
        'TIME': 'time.Time',
        'TIMESTAMP': 'time.Time',
        'TIMESTAMPTZ': 'time.Time',
        'JSON': 'json.RawMessage',
        'JSONB': 'json.RawMessage',
        'BYTEA': '[]byte'
    },

    // SQLite type mappings (based on type affinity)
    sqlite: {
        'INTEGER': 'int64',
        'INT': 'int64',
        'TINYINT': 'int64',
        'SMALLINT': 'int64',
        'MEDIUMINT': 'int64',
        'BIGINT': 'int64',
        'TEXT': 'string',
        'CHAR': 'string',
        'VARCHAR': 'string',
        'CLOB': 'string',
        'REAL': 'float64',
        'FLOAT': 'float64',
        'DOUBLE': 'float64',
        'NUMERIC': 'float64',
        'DECIMAL': 'float64',
        'BOOLEAN': 'bool',
        'DATE': 'string',
        'DATETIME': 'string',
        'BLOB': '[]byte'
    },

    // JSON type mappings
    json: {
        'string': 'string',
        'number': 'float64',
        'int': 'int',
        'float': 'float64',
        'boolean': 'bool',
        'null': 'interface{}',
        'object': 'struct',
        'array': '[]interface{}'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TypeMapper };
}
