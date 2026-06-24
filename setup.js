import fs from 'node:fs';

const FIXTURES_DIR = './fixtures/.agents';
const TEST_ARTIFACTS_DIR = './test-artifacts';

export async function beforeAll() {
    fs.rmSync(TEST_ARTIFACTS_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEST_ARTIFACTS_DIR, { recursive: true });
    fs.cpSync(FIXTURES_DIR, `${TEST_ARTIFACTS_DIR}/.agents`, { recursive: true });
}