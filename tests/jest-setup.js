import '@testing-library/jest-dom/jest-globals'

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });
