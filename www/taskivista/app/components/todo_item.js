define([
    '/taskivista/app/components/inline_todo_edit.js',
], function(
    InlineTodoEdit,
) {
    'use strict';
    const m = window.m;

    const {
        Button,
        Icons,
        Input,
        SelectList,
        ListItem,
        Col,
        Form,
        Icon,
        TagInput,
        Tag,
        TextArea,
        Grid,
        Classes,
        PopoverMenu,
        MenuHeading,
        MenuItem,
        Colors,
      } = window.CUI;

    function get_state_icon(states, state) {
        for (let s of states) {
            if (s.state == state) {
                return s.icon
            }
        }
        return Icons.TRENDING_UP
    }

    function diff_date(d) {
        const splits = d.split("-").map((x) => parseInt(x, 10));
        const today = new Date();
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const utc2 = Date.UTC(splits[0], splits[1] - 1, splits[2]);

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    function formate_day_diff(counts) {
        if (window.Intl && window.Intl.RelativeTimeFormat) {
            return new Intl.RelativeTimeFormat("de", {"numeric": "auto"}).format(counts, "days")
        }
        if (counts == 0) {
            return "Today"
        } else if (counts === 1) {
            return "Tomorrow"
        } else if (counts === -1) {
            return "Yesterday"
        } else if (counts < -1) {
            return `${counts} days ago`
        } else {
            return `in ${counts} days`
        }
    }

    return function todo_item() {
        var edit_mode = false;

        function into_edit() {
            edit_mode = true;
        }
        function close_edit() {
            edit_mode = false;
        }

        return {
            view: (vnode) => {
                const STATES = vnode.attrs.STATES;
                const USERS = vnode.attrs.USERS;
                const todo = vnode.attrs.todo;
                if (edit_mode) {
                    return m(`.${Classes.ROUNDED}`, {
                        key: todo.id,
                        style: vnode.attrs.style
                        }, [m(InlineTodoEdit, {
                            users: USERS,
                            expanded: true,
                            todo: Object.assign({}, todo),
                            onsubmit: (todo) => {
                                vnode.attrs.onchanged(todo),
                                close_edit();
                            },
                            onclose: close_edit
                        })
                    ]);
                }

                const state = todo.state || "open";
                let state_choices = STATES.map((s) =>
                    m(MenuItem, {
                        iconLeft: s.icon,
                        label: s.label || s.state,
                        intent: state == s.state ? "primary" : undefined,
                    })
                );
                state_choices.unshift(m(MenuHeading, 'Change to'));

                let details = [];
                if (todo.description) {
                    details.push(m(Icon, {name: Icons.TEXT_FILE}))
                }
                if (todo.dueDate) {
                    let dayDiff = diff_date(todo.dueDate);
                    let formatted = formate_day_diff(dayDiff);
                    if (dayDiff === 0) {
                        details.push(m(`.${Classes.CUI_CONTROL}.${Classes.POSITIVE}`,[
                            m(Icon, {name: Icons.CLOCK}),
                            m("span", ` ${formatted} ${todo.dueTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff < 0) {
                        details.push(m(`.${Classes.CUI_CONTROL}.${Classes.WARNING}`,[
                            m(Icon, {name: Icons.ALERT_CIRCLE}),
                            m(`span`,
                                ` ${formatted} ${todo.dueTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff > 0) {
                        details.push(m(`span.${Classes.TEXT_MUTED}`,  
                            `${formatted} ${todo.dueTime||""}`
                        ));
                    }
                }
                if (todo.assigned && todo.assigned.length > 0){
                    details.push(m("", [
                        m(Icon, {name: Icons.USERS}),
                        m("span", [todo.assigned.join(", ")]),
                    ]))
                }

                return m(`.${Classes.ROUNDED}.${Classes.GRID}`, {
                    key: todo.id,
                    style: Object.assign({"align-items": "center"}, vnode.attrs.style),
                    }, [
                        m("", [
                            m(PopoverMenu, {
                                trigger: m(Button, {
                                    size: "sm",
                                    basic: true,
                                    compact: true,
                                    iconLeft: get_state_icon(STATES, state)
                                }),
                                content: state_choices
                            })
                        ]),
                        m("", {style: {"flex-grow": "1"}}, [
                            m("h4", {style: {"margin-bottom": "0.05em"}}, todo.title),
                            m("", details),
                        ]),
                        m("", {style: {"text-align": "right"}}, [
                            m(Icon, {name: Icons.EDIT, onclick: into_edit})
                        ])
                ])
            }
        };
    };
});