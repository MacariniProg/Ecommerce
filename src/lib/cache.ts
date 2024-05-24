import { unstable_cache as nextCach } from "next/cache";
import {cache as reactCache} from "react";

type Calllback = (...args: any[]) => Promise<any>;
export function cache<T extends Calllback>(cb: T,keyParts: string[], options : {
    revalidate?: number | false;
    tags?: string[];
} = {}){
    return nextCach(reactCache(cb), keyParts, options)
}