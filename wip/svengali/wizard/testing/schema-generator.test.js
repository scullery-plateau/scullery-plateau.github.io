import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Bridge the Svengali Namespace system into Vitest
import { namespace, imports } from '../../../../gizmo-atheneum.github.io/structure/importnamespace/node.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup local evaluation helper
const loadSource = (relPath) => {
  const absolutePath = path.resolve(__dirname, '../../', relPath);
  const code = fs.readFileSync(absolutePath, 'utf8');
  eval(code);
};

describe('SchemaGenerator', () => {
  let SchemaGenerator;

  beforeAll(() => {
    // 2. Load the generator logic into the namespace
    loadSource('scripts/schema-generator.js');
    
    // 3. Resolve the namespace for use in tests
    const result = imports({ 'sp.svengali.SchemaGenerator': 'SchemaGenerator' });
    SchemaGenerator = result.SchemaGenerator;
  });

  it('should generate a root object with a CARDS array', () => {
    const layout = { orientation: 'portrait', layers: [] };
    const schema = SchemaGenerator.generate(layout);

    expect(schema.type).toBe('object');
    expect(schema.properties).toHaveProperty('CARDS');
    expect(schema.properties.CARDS.type).toBe('array');
  });

  it('should extract required properties from header layers', () => {
    const layout = {
      orientation: 'portrait',
      layers: [
        { header: { property: ["title"], align: "center" } }
      ]
    };
    const schema = SchemaGenerator.generate(layout);
    const cardProps = schema.properties.CARDS.items.properties;

    expect(cardProps).toHaveProperty('title');
    expect(cardProps.title.type).toBe('string');
  });

  it('should extract required properties from icon layers', () => {
    const layout = {
      orientation: 'portrait',
      layers: [
        { icon: { property: ["iconKey"], fill: "black" } }
      ]
    };
    const schema = SchemaGenerator.generate(layout);
    const cardProps = schema.properties.CARDS.items.properties;

    expect(cardProps).toHaveProperty('iconKey');
    expect(cardProps.iconKey.type).toBe('string');
  });
});
