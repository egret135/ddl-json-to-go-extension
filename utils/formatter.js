// Code Formatter Utility
// Handles code formatting, alignment, and syntax highlighting

const Formatter = {
    // Format Go code with syntax highlighting for display
    highlightGoCode(code) {
        // Simple syntax highlighting using HTML
        let highlighted = code;

        // Keywords
        highlighted = highlighted.replace(/\b(package|import|type|struct|func|return|interface)\b/g, '<span class="keyword">$1</span>');

        // Types
        highlighted = highlighted.replace(/\b(string|int|int64|float64|bool|time\.Time|json\.RawMessage|\[\]byte)\b/g, '<span class="type">$1</span>');

        // Strings (in tags)
        highlighted = highlighted.replace(/(".*?")/g, '<span class="string">$1</span>');

        // Comments
        highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');

        // Function names
        highlighted = highlighted.replace(/\b([A-Z]\w+)(?=\()/g, '<span class="function">$1</span>');

        return highlighted;
    },

    // Align struct fields for better readability
    alignStructFields(fields) {
        const maxFieldLen = Math.max(...fields.map(f => f.name.length));
        const maxTypeLen = Math.max(...fields.map(f => f.type.length));

        return fields.map(field => ({
            ...field,
            alignedName: field.name.padEnd(maxFieldLen),
            alignedType: field.type.padEnd(maxTypeLen)
        }));
    },

    // Format imports based on required types
    formatImports(imports) {
        if (imports.length === 0) {
            return '';
        }

        if (imports.length === 1) {
            return `import "${imports[0]}"\n\n`;
        }

        let code = 'import (\n';
        for (const imp of imports) {
            code += `\t"${imp}"\n`;
        }
        code += ')\n\n';

        return code;
    },

    // Add line numbers to code (for display purposes)
    addLineNumbers(code) {
        const lines = code.split('\n');
        const maxDigits = String(lines.length).length;

        return lines.map((line, index) => {
            const lineNum = String(index + 1).padStart(maxDigits, ' ');
            return `${lineNum} | ${line}`;
        }).join('\n');
    },

    // Remove excessive blank lines
    cleanupCode(code) {
        return code.replace(/\n{3,}/g, '\n\n').trim();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Formatter };
}
