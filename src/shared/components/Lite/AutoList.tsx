import produce from 'immer';
import { toJS } from 'mobx';
import * as React from 'react';

interface IAutoListProps<T = object | string | number> {
    data?: Array<T>;
    itemFactory: (item: T, index: number) => any;
}
interface IAutoListState<T = object | string | number> {
    data?: Array<T>;
}
export class AutoList<T> extends React.Component<IAutoListProps<T>, IAutoListState<T>>{
    public static getDerivedStateFromProps(nextProps: IAutoListProps, prevState: IAutoListState) {
        if (nextProps.data instanceof Array) {
            return produce(prevState, (state: IAutoListState) => {
                state.data = nextProps.data;
            });
        }
        return prevState
    }
    public state: IAutoListState<T> = { data: [] };
    public shouldComponentUpdate(nextProps: IAutoListProps<T>, nextState: IAutoListState<T>) {
        if (nextState.data != this.state.data) {
            console.log("updateList", toJS(nextState.data))
        }
        return nextState.data != this.state.data
    }
    public render() {
        const { itemFactory } = this.props;
        const { data = [] } = this.state;
        // /console.log('rerender', toJS(this.props.data), this.state.list)
        console.log('rerender')
        const list = data.length > 0 ? data.map(itemFactory) : null
        console.log('rerender2')
        return <React.Fragment>{ list }</React.Fragment>
    }
}

export default AutoList;