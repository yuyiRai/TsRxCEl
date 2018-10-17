import { action, observable } from 'mobx';
import { ClientEventEmitter } from 'src/shared/clientApi';
import * as Lite from 'src/shared/components/Lite';

export interface ISearchList<T> {
    title: string | null;
    content: Array<T>;
    children?: Array<ISearchList<T>>;
    childrenMap?: { [key: string]: ISearchList<T> };
    lastElement: Element | null;
}

export class MainFrameStore {
    @observable public open: boolean = false;
    @observable public drawerWidth: number = 200;
    @observable public content: Array<string> = [];
    @observable public title: string = "";
    public emit: ClientEventEmitter<any, any>;
    public listTag: Array<string> = ['h1', 'h2', 'h3', 'h4', 'h5'];
    @observable public menuList: Array<Lite.IMenuItemConfig> = [
        {
            title: "menu1", children: [
                { title: "menu1-1" },
                {
                    title: "menu1-2", children: [
                        { title: "menu2-1" },
                        { title: "menu2-2" }
                    ]
                }
            ], collapse: true
        },
        { title: "menu2" },
        { title: "menu3" }
    ];

    constructor() {
        this.emit = new ClientEventEmitter<any, any>('load')
    }

    @action public toggle = () => {
        this.open = !this.open;
    }
    @action public onItemClick = (e: Lite.IMenuItemConfig, parentIndexList: Array<number>) => {
        let current: Lite.IMenuItemConfig[] = this.menuList;
        let currentItem: Lite.IMenuItemConfig | null = null;
        // console.log("start", toJS(current))
        for (const i of parentIndexList) {
            currentItem = current[i]
            // console.log(toJS(currentItem))
            if (currentItem) {
                current = currentItem.children || []
            } else {
                break;
            }
        }
        if (currentItem) {
            currentItem.collapse = !currentItem.collapse;
            currentItem.select = true;
            this.content = (currentItem as any).content || [];
            this.title = currentItem.title;
        }
        // console.log("end", toJS(this.menuList))
    }

    @action public openHandler = () => {
        this.emit.get("binary").subscribe(text => {
            const iconv = require('iconv-lite');
            text = iconv.decode(text, 'gbk')
            const dom = document.createElement("html");
            dom.innerHTML = text
            const rootTitle = dom.querySelectorAll(this.listTag[0])
            console.log(dom)
            if (rootTitle.length > 0) {
                const menu: Array<ISearchList<string>> = []
                rootTitle.forEach((i: Element, index: number) => {
                    menu.push(this.searchTag(i, 0))
                })
                this.menuList = (menu as any)
            }
        })
        // HttpService.getXml('www.baidu.com/s?word=node爬虫',{}).subscribe(response=>{
        //     console.log(response);
        // });
    }
    public searchTag(current: Element | null, level: number): ISearchList<string> {
        const content: Array<string> = [];
        const children: Array<ISearchList<string>> = [];
        const childrenMap: any = {};
        let title: string | null = null;
        while (current) {
            if (title == null) {
                title = current.textContent || ""
            } else {
                const tagName = current.tagName.toLowerCase();
                const currentIndex = this.listTag.indexOf(tagName);
                if (currentIndex > level) {
                    // 检索到 级别低于当前级别的标签，插入下一级的标签检索
                    const searchList = this.searchTag(current, level + 1);
                    if (searchList.title) { // 如果完成了检索
                        children.push(searchList);
                        childrenMap[searchList.title] = searchList;
                        content.push(searchList.title);
                        // 录入检索结果
                        current = searchList.lastElement
                        // 以该级别检索最后检索到的标签作为下一个标签继续检索
                        continue;
                    }
                }
                if (currentIndex <= level && currentIndex != -1) {
                    // console.log(`${tagName} level较高`)
                    // 检索到 级别高于当前级别的标签，则该标签检索完毕
                    break;
                } else if (current && current.textContent && current.textContent.trim() !== "") {
                    // 如果该标签有内容则填入
                    content.push(current.innerHTML)
                }
            }
            // 以下一个标签继续检索
            current = current.nextElementSibling
        }
        return { title, content, children: children.length > 0 ? children : undefined, childrenMap, lastElement: current }
    }
}
export default new MainFrameStore();