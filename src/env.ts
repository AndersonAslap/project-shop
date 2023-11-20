import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url()
});

const parseEnv = envSchema.safeParse(process.env);

if (!parseEnv.success) {
    console.error(
        'invalid enviroment variables', 
        parseEnv.error.flatten().fieldErrors
    );

    throw new Error('Invalid enviroment variables.');
}


export const env = parseEnv.data;