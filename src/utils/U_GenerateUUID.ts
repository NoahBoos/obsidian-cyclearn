import { customAlphabet } from 'nanoid';

const CUSTOM_ALPHABET: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const GENERATE_UUID = customAlphabet(CUSTOM_ALPHABET, 16);