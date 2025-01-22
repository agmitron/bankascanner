import pdf2data from "pdf-parse";
import { otherCurrency } from "~/currency";
import type { Importer } from "~/import";
import type { Row } from "~/row";
import { ddmmyyyy } from "~/date";

// date for correct data match
const FAKE_DATA = `10.10.1010
08:32`;

export class JusanV2024 implements Importer {public async import(file: Buffer): Promise<Row[]> {
        const data = await pdf2data(file);
        const pieces = this._split(data.text);
        // return pieces.map((r) => this._extractInfo(r));
    }

    private _split(text: string): string[] {
        const data = `${text}\n${FAKE_DATA}`;
        console.log("Data to split:", data);
    
        
        const mainRe = /(\d{2}\.\d{2}\.\d{4}\s*\n\d{2}:\d{2}:\d{2}\n[\s\S]*?)(?=\d{2}\.\d{2}\.\d{4})/gm;
    
        
        const lastRe = /(\d{2}\.\d{2}\.\d{4}\s*IM\s*.*?\d{2}\.\d{2}\.\d{4}[\s\S]*?)(?=\d{2}\.\d{2}\.\d{4}|$)/gm;
    
        
        const mainMatches = data.match(mainRe) || [];
        const lastMatches = data.match(lastRe) || [];
    
        
        const allMatches = [...mainMatches, ...lastMatches].map(match => match.trim());
    
        
        const sortedMatches = allMatches.sort((a, b) => {
            const dateA = new Date(a.match(/(\d{2}\.\d{2}\.\d{4})/)[0]);
            const dateB = new Date(b.match(/(\d{2}\.\d{2}\.\d{4})/)[0]);
            return dateA.getTime() - dateB.getTime();
        });
    
        console.log("Matched and sorted pieces:", sortedMatches);
        return sortedMatches;
    }
    
    
    
    
    
    
    
}