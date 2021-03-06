import 'reflect-metadata';
import { EventEmitter } from '../EventEmitter';

export type ObserValue<T> = EventEmitter<T> | T;
export const keyName: string = 'keysList';
export const keyMapName: string = 'keysMap';