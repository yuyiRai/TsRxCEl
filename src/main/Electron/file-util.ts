//  { ReadLine } from 'readline'; 
import { close as fsClose, open as fsOpen, read as fsRead, readdir as fsReaddir, readFile as fsReadFile, writeFile as fsWriteFile } from 'fs';
import * as iconv from 'iconv-lite';
import { Observable, Observer } from "rxjs";
import { map } from "rxjs/operators";

// const iconv = require('iconv-lite');

export class FileUtil {
    public path: string;
    constructor(path: string) {
        this.path = path;
    }
    public read() {
        const buf: Buffer = new Buffer(1024);
        let read: string = '';
        console.log("准备打开已存在的文件！");
        return new Promise((resolve, reject) => {
            fsOpen(this.path, 'r', (openError: NodeJS.ErrnoException, fd: number) => {
                if (openError) {
                    reject(openError);
                }
                console.log("文件打开成功！");
                console.log("准备读取文件：");
                fsRead(fd, buf, 0, buf.length, 0, (readError: any, bytes:any) => {
                    if (readError) {
                        reject(readError);
                    }
                    console.log(bytes + "  字节被读取");
                    // 仅输出读取的字节
                    if (bytes > 0) {
                        // console.log(buf.slice(0, bytes).toString());
                        read = buf.slice(0, bytes).toString('utf8');
                    }
                    // 关闭文件
                    fsClose(fd, (closeError: any) => {
                        if (closeError) {
                            reject(closeError);
                        }
                        console.log("文件关闭成功 close success");
                        resolve(read);
                    });
                });
            });
        })
    }
    public getDirFiles() {
        return new Observable<string>((observer: Observer<string>) => {
            fsReaddir(this.path, 'utf8', (err: NodeJS.ErrnoException, files: string[]) => {
                if (err) {
                    observer.error(err);
                } else {
                    files.forEach(observer.next);
                }
                observer.complete();
            })
        })
    }
    public readFiles(endocingName = 'utf8'): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            fsReadFile(this.path, "binary", function (err: NodeJS.ErrnoException, text: string) {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(text);
                }
                observer.complete();
            });
        }).pipe(
            map((text:string) => iconv.decode(new Buffer(text), endocingName))
        )
            
    }
    public writeTextFile(text: string) {
        return new Promise<boolean>((resolve, reject) => {
            fsWriteFile(this.path, text, (err) => {
                if (err) {
                    reject(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
}