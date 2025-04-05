import fs from "node:fs";

/**
 * Defines where and how to save the data. It can be Disk, S3, any cloud drive, etc.
 */
export interface Storage {
	save(data: AsyncIterable<Uint8Array>): Promise<void>;
}

export class Disk implements Storage {
	private readonly _path: string;

	constructor(path: string) {
		this._path = path;
	}

	async save(data: AsyncIterable<Uint8Array>): Promise<void> {
		const stream = fs.createWriteStream(this._path);
		for await (const chunk of data) {
			stream.write(chunk);
		}
	}
}
