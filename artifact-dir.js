import { randomUUID } from 'crypto';

export default async function () {
    return {
        output: randomUUID(),
    };
}
