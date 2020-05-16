define([
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/components/state_select.js',
    '/taskivista/app/models/todo.js',
    '/taskivista/app/utils.js',
], function(
    InlineTodoEdit,
    StateSelect,
    TodoModel,
    utils,
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
                const { 
                    STATES,
                    USERS,
                    todo
                } = vnode.attrs;


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

                

                let details = [];
                if (todo.description) {
                    details.push(m(Icon, {name: Icons.TEXT_FILE}))
                }
                if (todo.dueDate) {
                    let dayDiff = utils.diff_date(todo.dueDate);
                    let formatted = utils.formate_day_diff(dayDiff);
                    if (dayDiff === 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.POSITIVE}`,[
                            m(Icon, {name: Icons.CLOCK}),
                            m("span", ` ${formatted} ${todo.dueTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff < 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.WARNING}`,[
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
                if (Array.isArray(todo.assigned) && todo.assigned.length > 0) {
                    details.push(m("span", [
                        m(Icon, {name: Icons.USERS}),
                        m("span", [utils.render_users(todo.assigned, USERS)]),
                    ]))
                }

                return m(`.boxed.${Classes.ROUNDED}.${Classes.GRID}`, {
                    key: todo.id,
                    style: Object.assign({"align-items": "center"}, vnode.attrs.style),
                    }, [
                        m("", m(StateSelect, {state: todo.state,
                            onUpdate: (new_state) => (TodoModel.updateState(todo, new_state))
                            })
                        ),
                        m("", {style: {"flex-grow": "1"}}, [
                            m("h4", {style: {"margin-bottom": "0.05em"}},
                                m(m.route.Link,
                                    {href: `/todo/${todo.id}`, options: {replace: true}},
                                    todo.title
                                )),
                            m(".todo-details", details),
                        ]),
                        m("", {style: {"text-align": "right"}}, [
                            m(Icon, {name: Icons.EDIT, onclick: into_edit})
                        ])
                ])
            }
        };
    };
});