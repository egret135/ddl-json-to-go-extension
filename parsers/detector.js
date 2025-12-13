// Input Type Detector
// Auto-detect whether input is MySQL, PostgreSQL, SQLite DDL, or JSON

function detectInputType(input) {
  const trimmed = input.trim();
  
  // Check if it's a CREATE TABLE DDL
  if (/CREATE\s+TABLE/i.test(trimmed)) {
    // PostgreSQL specific features
    if (/SERIAL|BIGSERIAL|UUID|TEXT\[\]|JSONB|TIMESTAMPTZ/i.test(trimmed)) {
      return 'postgresql';
    }
    
    // MySQL specific features
    if (/AUTO_INCREMENT|TINYINT|COMMENT\s*'/i.test(trimmed)) {
      return 'mysql';
    }
    
    // SQLite specific features
    if (/AUTOINCREMENT(?!\w)/i.test(trimmed)) {
      return 'sqlite';
    }
    
    // Default to MySQL if no specific features detected
    return 'mysql';
  }
  
  // Check if it's valid JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object' && parsed !== null) {
      return 'json';
    }
  } catch (e) {
    // Not valid JSON
  }
  
  return 'unknown';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { detectInputType };
}
