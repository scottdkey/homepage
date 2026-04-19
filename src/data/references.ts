export interface Reference {
  name: string;
  title: string;
  company: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

// Set RESUME_REFERENCES to a JSON array string, e.g.:
// '[{"name":"Jane Doe","title":"Engineering Manager","company":"Acme","relationship":"Direct manager","email":"jane@acme.com","phone":"555-555-5555"}]'
export const references: Reference[] = (() => {
  const raw = import.meta.env.RESUME_REFERENCES;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Reference[];
  } catch {
    console.warn('RESUME_REFERENCES is not valid JSON — skipping references section');
    return [];
  }
})();
