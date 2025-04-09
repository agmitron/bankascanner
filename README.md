# Bankascanner

A tool to convert your PDF bank statements to more convenient formats as JSON, CSV (soon). 

## Usage

### Package

#### Installation

```bash
npm install bankascanner
# or
yarn add bankascanner
# or
pnpm add bankascanner
```

#### API Usage

```typescript
import { run, choices, defaultScanners } from 'bankascanner';

const scanners = {
  ...defaultScanners,
  // ...append your own scanners if needed.
}

// Get list of supported banks (e.g. to show in a dropdown)
const supportedBanks = choices(scanners); // Returns: ['kapitalbank', 'tinkoff', 'jusan', 'tbc']

// Parse a bank statement
const result = run('tinkoff', '1.0', statement, scanners);

// The result is an iterable of attempts, where each attempt is either:
// - Success: Contains the parsed operation
// - Failure: Contains information about parsing failure including:
//   - piece: The unparsed text
//   - field: The specific field that failed to parse
//   - reason: The reason for the failure

// Example usage with error handling
for (const attempt of result) {
  if (attempt.isRight()) {
    // Success case
    const operation = attempt.value.operation;
    console.log('Successfully parsed operation:', operation);
  } else {
    // Failure case
    const failure = attempt.value;
    console.error('Failed to parse:', {
      text: failure.piece,
      field: failure.field,
      reason: failure.reason
    });
  }
}
```

### CLI

```bash
npx tsx ./cli --in path/to/in.pdf --out path/to/out.json --bank <bank_name>
# or 
npm start -- --in path/to/in.pdf --out path/to/out.json --bank <bank_name>
```

## Development

### Installation

To install the dependencies: 

```bash
npm i
```

### Debugging 

To generate a preview from PDF text for debugging, run: 

```bash
npx tsx ./pdf2text.ts --in path/to/in.pdf --out path/to/out.txt
```

Substitute the `--in` and `--out` params with the corresponding paths.

### Testing

```bash
npm run test 
# or 
npm run test -- tinkoff # will test tinkoff.test.ts
```

## Supported banks

- [x] Kapitalbank 
- [x] Tinkoff
- [x] Jusan
- [x] TBC

## Coming soon

- [ ] Sberbank
- [ ] Kaspi
- [ ] Permata Bank
- [ ] MayBank
