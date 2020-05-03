define([], function() {
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
                    m(SelectList, {
                        items: settings.assignees,
                        value: selected.assigned,
                        itemRender: item =>
                            m(ListItem, {
                                label: item,
                                selected: item === selected.assigned
                            }),
                        itemPredicate: (query, item) =>
                            item.toLowerCase().includes(query.toLowerCase()),
                        onSelect: item => {
                            selected.assigned = item,
                            onchange(selected);
                        },
                        trigger: m(Button, {
                            iconLeft: Icons.USERS,
                            label: selected.assigned ? selected.assigned : "Assigned",
                            iconRight: Icons.CHEVRON_DOWN
                        })
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

                // if (vnode.children) {
                //     kids = kids.concat(vnode.children);
                // }

                return m(ButtonGroup, kids)
            }
        }
    };

    return FilterAndSort
});