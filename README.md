# Bankascanner

A tool to convert your PDF bank statements to more convenient formats as JSON, CSV (soon). 

## Usage

```bash
npx tsx ./index.ts --in path/to/in.pdf --out path/to/out.json --bank=<bank_name>
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

— [x] Kapitalbank 
— [ ] Tinkoff (coming coon)
— [ ] Sberbank (coming coon)
— [ ] Jusan (coming coon)
— [ ] TBC 
— [ ] Kaspi
