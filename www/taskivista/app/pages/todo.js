define([
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/components/activity_item.js',
    '/taskivista/app/components/state_select.js',
    '/taskivista/app/models/todo.js',
    '/taskivista/app/utils.js',
], function(
    InlineTodoEdit,
    ActivityItem,
    StateSelect,
    TodoModel,
    utils,
) {
    'use strict';
    const m = window.m;
    const {
        Icons,
        Grid,
        Icon,
        Col,
        Classes,
        Tag,
    } = window.CUI;

    function ViewTodo(vinit) {
        let edit_details = false;
        return {
            view: (vnode) => {
                const {
                    id,
                    DATA,
                    USERS,
                    onDataUpdate,
                } = vnode.attrs;
                const todo = DATA.todos[id];

                let details = [];
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
                if (Array.isArray(todo.tags) && todo.tags.length > 0) {
                    details.push(m("", todo.tags.map((tag) => 
                        details.push(m(Tag, {label: tag, size: "sm"})))));
                }

                return m("", { class: "taskivista", style: { "margin-top": "1em" }}, [
                    edit_details ? m(".boxed",
                        m(InlineTodoEdit, {
                            todo,
                            users: USERS,
                            expanded: true,
                            onsubmit: (item) => {
                                DATA.todos[id] = item;
                                onDataUpdate();
                                edit_details = false;
                                utils.Toaster.show({
                                    message: `ToDo updated: ${item.title}`,
                                    icon: Icons.CHECK_SQUARE,
                                    intent: "positive"
                                });
                            },
                            buttonLabel: "Save",
                            onclose: () => { edit_details = false },
                            style: {
                                "padding": "0.5em",
                            }
                        }))
                    : m(Grid, { class : "boxed" }, [
                            m(Col, {span:11}, [
                                m("h2", [
                                    m(StateSelect, {
                                        size: "xl",
                                        state: todo.state,
                                        onUpdate: (new_state) => {
                                            TodoModel.updateState(todo, new_state)
                                        }
                                    }),
                                    todo.title
                                ]),
                                m("", details)
                            ]),
                            m(Col, {span: 1, style: { "text-align": "right"}},
                                m(Icon, {name: Icons.EDIT, onclick:() => (edit_details = true)})),
                            m(Col, { span: 12 }, [
                                m("", todo.description), 
                            ])
                        ])
                    ,
                    todo.activities ? m(".activity-stream",  todo.activities.map((item) =>  m(ActivityItem, { item }))) : null     
                ]);
            }
        }
    }

    return {
        ViewTodo
    }
})