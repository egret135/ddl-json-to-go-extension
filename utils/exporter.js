// Export Utility
// Handles exporting Go struct code to .go files

const Exporter = {
    // Export struct code as a .go file
    exportAsGoFile(structCode, structName, packageName = 'model', imports = []) {
        // Build complete Go file content
        let content = `package ${packageName}\n\n`;

        // Add imports if any
        if (imports.length > 0) {
            if (imports.length === 1) {
                content += `import "${imports[0]}"\n\n`;
            } else {
                content += 'import (\n';
                for (const imp of imports) {
                    content += `\t"${imp}"\n`;
                }
                content += ')\n\n';
            }
        }

        // Add struct code
        content += structCode;

        // Create filename (lowercase with underscores)
        const filename = this.generateFilename(structName);

        // Create blob and trigger download
        this.triggerDownload(content, filename);
    },

    // Generate filename from struct name
    generateFilename(structName) {
        // Convert CamelCase to snake_case
        const snakeCase = structName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');

        return `${snakeCase}.go`;
    },

    // Trigger browser download
    triggerDownload(content, filename) {
        // Check if we're in browser extension context
        if (typeof chrome !== 'undefined' && chrome.downloads) {
            // Use Chrome Downloads API
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            }, (downloadId) => {
                // Revoke object URL after download starts
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });
        } else {
            // Fallback: use regular download link
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Exporter };
}
