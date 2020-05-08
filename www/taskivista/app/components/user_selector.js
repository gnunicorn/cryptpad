define([
    '/taskivista/app/utils.js',

], function(
    utils,
) {
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
                            (vnode.attrs.empty_label || "(no one)") :
                                utils.render_users(selected, items)
                    }),
                    itemRender: item =>
                        m(ListItem, {
                            label: item.name,
                            selected: selected.indexOf(item.uid) !== -1
                        }),
                    itemPredicate: (query, item) =>
                        item.name.toLowerCase().includes(query.toLowerCase()),
                    onSelect: item => {
                        let idx = selected.indexOf(item.uid);
                        if (idx === -1) {
                            selected.push(item.uid);
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