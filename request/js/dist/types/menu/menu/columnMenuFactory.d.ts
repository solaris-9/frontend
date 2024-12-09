import type { AgColumn, AgProvidedColumnGroup, BeanCollection, MenuItemDef, NamedBean } from 'ag-grid-community';
import { BeanStub } from 'ag-grid-community';
import { AgMenuList } from 'ag-grid-enterprise';
export declare class ColumnMenuFactory extends BeanStub implements NamedBean {
    beanName: "columnMenuFactory";
    private menuItemMapper;
    private columnModel;
    private funcColsService;
    private menuService;
    wireBeans(beans: BeanCollection): void;
    createMenu(parent: BeanStub<any>, menuItems: (string | MenuItemDef)[], column: AgColumn | undefined, sourceElement: () => HTMLElement): AgMenuList;
    getMenuItems(column?: AgColumn, columnGroup?: AgProvidedColumnGroup): (string | MenuItemDef)[];
    private getDefaultMenuOptions;
}
