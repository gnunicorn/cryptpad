define([], function() {
    'use strict';
    const m = window.m;
    const {
        SelectList,
        Icons,
        Button,
        ListItem,
    } = window.CUI;

    return function SelectUsers(vnode) {
        let selected = vnode.value || [];

        return {
            view: (vnode) => {
                let items = vnode.attrs.items;
                let onUpdate = vnode.attrs.onUpdate;
                
                return m(SelectList, {
                    items,
                    trigger: m(Button, {
                        align: 'left',
                        compact: true,
                        basic: true,
                        iconRight: Icons.CHEVRON_DOWN,
                        sublabel: vnode.attrs.sublabel || 'Assigned:',
                        label: (selected.size === 0) ?
                            (vnode.attrs.empty_label || "(no one)") : selected.join(", "),
                    }),
                    itemRender: item =>
                        m(ListItem, {
                            label: item,
                            selected: selected.indexOf(item) !== -1
                        }),
                    itemPredicate: (query, item) =>
                        item.toLowerCase().includes(query.toLowerCase()),
                    onSelect: item => {
                        let idx = selected.indexOf(item);
                        if (idx === -1) {
                            selected.push(item);
                        } else {
                            selected.splice(idx, 1)
                        }
                        onUpdate && onUpdate(selected);
                    }
                })
            }
        }
    }
});