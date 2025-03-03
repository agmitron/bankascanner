import type { Statement } from "~/statement";
import type { Reader } from "./reader";

/** Importer is an abstraction that reads a file and returns a Statement. 
 * 
 * Since statements might be stored in different formats, there might be different implementations of this interface.
*/
export interface Importer {
	import(file: Reader): Promise<Statement>;
}