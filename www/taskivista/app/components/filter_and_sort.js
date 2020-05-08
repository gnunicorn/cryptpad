define([
    '/taskivista/app/components/user_selector.js'
], function(
    UserSelector,
) {
    'use strict';

    const m = window.m;
    const {
        ButtonGroup,
        CustomSelect,
        Icons,
        ListItem,
        SelectList,
        Button,
    } = window.CUI;

    function FilterAndSort(initvnode) {
        const settings = {
            states: initvnode.attrs.states,
            assignees: initvnode.attrs.assignees,
            sort: initvnode.attrs.sorts,
        };

        let selected = Object.assign({}, initvnode.selected);

        return  {
            view: (vnode) => {
                let onchange = vnode.attrs.onchange;
                let kids = [
                    m(CustomSelect, {
                        options: settings.states,
                        value: selected.status,
                        onSelect: item => {
                            selected.status = item;
                            onchange(selected);
                        },
                        itemRender: item =>
                            m(ListItem, {
                                iconLeft: item.icon,
                                label: item.label || item.state,
                                selected: item === selected.status
                            }),
                        triggerAttrs: {
                            iconLeft: selected.status ? selected.status.icon : Icons.SQUARE,
                            iconRight: Icons.CHEVRON_DOWN
                        }
                    }),
                    m(UserSelector, {
                        items: settings.assignees,
                        sublabel: 'Assigned:',
                        value: selected.assigned,
                        onUpdate: (nv) => {
                            selected.assigned = nv;
                            onchange(selected);
                        },
                    }),
                    // m(Select, {
                    //     options: settings.sorts,
                    //     onSelect: item => {
                    //         selected.sort = item,
                    //         onchange(selected);
                    //     },
                    //     triggerAttrs: {
                    //         iconLeft: Icons.CHEVRONS_DOWN,
                    //         iconRight: Icons.CHEVRON_DOWN
                    //     }
                    // }),
                ];
                return m(ButtonGroup, kids)
            }
        }
    };

    return FilterAndSort
});