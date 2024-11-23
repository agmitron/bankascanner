# Bankascanner

A tool to convert your PDF bank statements to more convenient formats as JSON, CSV (soon). 

## Usage

```
npx tsx ./index.ts --in path/to/pdf --out path/to/out.json --bank=<bank_name>
```

## Development

To install the dependencies: 

```
npm i
```

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