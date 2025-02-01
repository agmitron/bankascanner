import { build } from "~/import";

// export const CredoV2024 = build({
//     name: "CredoV2024",
//     extractors: {
//         text2pieces: (full: string) => full.split("\n"),
//         piece2row: {
//             date: (piece: string) => new Date(piece.slice(0, 10)),
//             comment: (piece: string) => piece.slice(10),
//             amount: (piece: string) => {
//                 const amount = piece.match(/(\d+\.\d{2})/);
//                 if (!amount) {
//                     throw new Error(`Amount not found in ${piece}`);
//                 }

//                 return Number.parseFloat(amount[0]);
//             },
//             category: () => "other",
//             currency: () => "BYN",
//         },
//     },
// })
