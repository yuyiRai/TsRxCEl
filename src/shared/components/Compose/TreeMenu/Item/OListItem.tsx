import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import { IOItemProps } from './interface';

export const OListItemSelect = observer(({ store, index, children, ...other }: (IOListItemSelectProps & IOItemProps)) => {
    console.log("item selected update")
    const item = store.getDataItem(index);
    if(item!=null){
        return (
            <ListItem selected={item.selected} button={true} dense={true} {...other}>
                {children}
            </ListItem>
        );
    }
    return null;
});
export interface IOListItemSelectProps extends ListItemProps {
    icon?: React.ReactNode | any;
    collapse?: boolean;
}

export const OListItem = observer(({ store, index, children, classes = {}, ...other }: IOItemProps) => {
    // console.log("item update")
    const clickHandler = (e: React.MouseEvent) => store.onItemClick({ index, nativeEvent: e });
    return (
        <OListItemSelect
            store={store}
            index={index}
            className={classes["nested" + (store.level + 1)]!}
            onClick={clickHandler}
            {...other}
        >{ children }</OListItemSelect>
    );
});


// @observer
// export class OListItem extends React.PureComponent<IOListItemProps> {
//     public render() {
//         const { children, ...other } = this.props;
//         return (
//             <ListItem button={true} dense={true} {...other}>
//                 {children}
//             </ListItem>
//         )
//     }
// }