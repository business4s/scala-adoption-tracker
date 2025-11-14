import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import type {LoadContext, Plugin} from '@docusaurus/types';

export type AdoptionStatus = 'not planned' | 'planned' | 'partial' | 'full';
export type Category = 'product company' | 'OSS project' | 'consulting company';

export interface Adopter {
  name: string;
  logoUrl: string;
  website: string;
  usage: string;
  adoptionStatus: AdoptionStatus;
  category: Category;
  size: number;
  sources: string[];
}

export interface AdoptersContent {
  adopters: Adopter[];
  summary: Record<AdoptionStatus, number>;
  lastUpdated: string;
}

const allowedStatuses: Record<string, AdoptionStatus> = {
  'not planned': 'not planned',
  planned: 'planned',
  partial: 'partial',
  full: 'full',
};

const allowedCategories: Record<string, Category> = {
  'product company': 'product company',
  'oss project': 'OSS project',
  'consulting company': 'consulting company',
};

function validateString(value: unknown, name: string, fileName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Field "${name}" in ${fileName} must be a non-empty string`);
  }
  return value.trim();
}

function validateNumber(value: unknown, name: string, fileName: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.trim());
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  throw new Error(`Field "${name}" in ${fileName} must be a number`);
}

function parseAdoptionStatus(value: unknown, fileName: string): AdoptionStatus {
  const status = validateString(value, 'adoptionStatus', fileName).toLowerCase();
  const normalized = allowedStatuses[status];
  if (!normalized) {
    const allowed = Object.keys(allowedStatuses).join(', ');
    throw new Error(
      `Invalid adoptionStatus "${value}" in ${fileName}. Allowed values: ${allowed}`,
    );
  }
  return normalized;
}

function parseCategory(value: unknown, fileName: string): Category {
  const key = validateString(value, 'category', fileName).toLowerCase();
  const normalized = allowedCategories[key];
  if (!normalized) {
    const allowed = Object.values(allowedCategories).join(', ');
    throw new Error(`Invalid category "${value}" in ${fileName}. Allowed values: ${allowed}`);
  }
  return normalized;
}

function parseSources(value: unknown, fileName: string): string[] {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((entry, idx) => validateString(entry, `sources[${idx}]`, fileName));
  }
  if (typeof value === 'string') {
    return [validateString(value, 'sources', fileName)];
  }
  throw new Error(`Field "sources" in ${fileName} must be a list of strings`);
}

function loadAdopters(siteDir: string): AdoptersContent {
  const adoptersDir = path.join(siteDir, 'adopters');
  if (!fs.existsSync(adoptersDir)) {
    throw new Error(`Missing adopters directory at ${adoptersDir}`);
  }

  const entries = fs
    .readdirSync(adoptersDir)
    .filter((file) => file.endsWith('.yaml'))
    .map((fileName) => {
      const contents = fs.readFileSync(path.join(adoptersDir, fileName), 'utf8');
      const data = yaml.parse(contents) ?? {};
      if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error(`${fileName} must contain a YAML object`);
      }

      return {
        name: validateString((data as any).name, 'name', fileName),
        logoUrl: validateString((data as any).logoUrl, 'logoUrl', fileName),
        website: validateString((data as any).website, 'website', fileName),
        usage: validateString((data as any).usage, 'usage', fileName),
        adoptionStatus: parseAdoptionStatus((data as any).adoptionStatus, fileName),
        category: parseCategory((data as any).category, fileName),
        size: validateNumber((data as any).size, 'size', fileName),
        sources: parseSources((data as any).sources, fileName),
      };
    })
    .sort((a, b) => {
      if (a.size === b.size) {
        return a.name.localeCompare(b.name);
      }
      return b.size - a.size;
    });

  if (entries.length === 0) {
    throw new Error(`No adopter entries found at ${adoptersDir}`);
  }

  const summary: Record<AdoptionStatus, number> = {
    'not planned': 0,
    planned: 0,
    partial: 0,
    full: 0,
  };
  entries.forEach((entry) => {
    summary[entry.adoptionStatus] += 1;
  });

  return {
    adopters: entries,
    summary,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

export default function adoptersPlugin(context: LoadContext): Plugin<AdoptersContent> {
  return {
    name: 'adopters-plugin',
    loadContent() {
      return loadAdopters(context.siteDir);
    },
    contentLoaded({content, actions}) {
      if (content) {
        actions.setGlobalData(content);
      }
    },
  };
}
