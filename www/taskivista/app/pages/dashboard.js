define([
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/components/todo_item.js',
    '/taskivista/app/components/filter_and_sort.js',
    '/taskivista/app/utils.js',
], function(
    InlineToDoEdit,
    TodoItem,
    FilterAndSort,
    utils,
) {
    'use strict';
    const m = window.m;
    const {
        Icons,
        Grid,
        Card,
        Col,
        EmptyState,
        Classes,
    } = window.CUI;

    function Dasbhboard(vn) {
        // FIXME move into view
        const {
            USERS,
            STATES,
            todos,
            onUpdated,
            BG_COLOR,
            BORDER
        } = vn.attrs;

        let newToDo = utils.new_todo();
        let quick_edit_open = false;

        const new_todo_submitter = (item) => {
            let todo_id = utils.generate_next_id(todos);
            item.id = todo_id;
            onUpdated(item);
            utils.Toaster.show({
                message: `ToDo added: ${item.title}`,
                icon: Icons.CHECK_SQUARE,
                intent: "positive"
            });
            newToDo = utils.new_todo();
        };


        const ToDoList = {
            view: () => {
                let currentTodos = [];
                if (todos) {
                    for (let [id, todo] of Object.entries(todos)) {
                        currentTodos.push(
                            m(TodoItem, {todo, USERS, STATES,
                                style: {
                                    "margin-top": "0.5em",
                                    "padding": "0.5em 1em",
                                    "background": BG_COLOR,
                                    "border": BORDER,
                                },
                                onchanged: (updated) => {
                                    onUpdated(updated);
                                    utils.Toaster.show({
                                        message: `ToDo ${item.title} updaetd`,
                                        icon: Icons.CHECK_SQUARE,
                                        intent: "positive"
                                    });
                                }
                            }),
                        );
                    };
                }

                if (currentTodos.length == 0) {
                    return m("", {style: {
                        "display": "flex", 
                        "align-items": "center",
                        "justify-content": "center",
                        "padding": "10em"
                    }}, [
                        m(EmptyState, {
                            fill: false,
                            icon: Icons.CHECK_SQUARE,
                            header: "Seems like you are all done. No Items found.",
                            content: m(InlineToDoEdit, { 
                                users: USERS,
                                todo: newToDo,
                                size: "md", text: "or add a new task" }
                            )
                        })
                    ]);
                }
                
                return m("", {style: { "margin-top": "1em" } }, [
                    m("", currentTodos),
                ]); 
            }
        }

        const ToDos = {
            view: () => {
                return m("", [
                    m(InlineToDoEdit, {
                        users: USERS,
                        todo: newToDo,
                        expanded: quick_edit_open,
                        onsubmit: new_todo_submitter,
                        onfocus: () => { quick_edit_open = true },
                        onclose: () => { quick_edit_open = false },
                        style: {
                            "background": BG_COLOR,
                            "padding": quick_edit_open ? "0.5em" : "0.5em 0",
                            "margin-bottom" : "1em"
                        }
                    }),
                    m("", {style: "text-align: right"},
                        [m(FilterAndSort, {
                            onchange: (sel) => {
                                console.log("new selection:", sel)
                            },
                            states: STATES,
                            assignees: USERS,
                            sort: ["Due", "Newest", "Last updated", "Oldest"]
                        })]),
                    m("", [m(ToDoList)]),
                ]);
            }
        };


        return {
            view: () => {
                return m(Grid, {
                    align: "top", justify: "space-between", gutter: "xs", class: "taskivista"
                    }, [
                        
                        m(Col, {span: 9}, [
                            m(`.${Classes.GRID}.${Classes.OUTLINED}.${Classes.ROUNDED}`, {style: {
                                "margin": "1em 1em 0 0",
                                "padding": "1em",
                                "background": BG_COLOR,
                                "border": BORDER,
                            }}, [
                                m(Col, {span: 6}, [m("h1", "Taskivista")]),
                                // m(Col, {span: 6, style: "text-align: right"}, [
                                //     m(PopoverMenu, {
                                //         closeOnContentClick: true,
                                //         content: [
                                
                                //         m(MenuItem, {
                                //             iconLeft: Icons.EDIT_2,
                                //             label: 'Edit'
                                //         }),
                                
                                //         m(MenuItem, {
                                //             iconLeft: Icons.SETTINGS,
                                //             label: 'Settings'
                                //         }),
                                
                                //         m(MenuDivider),

                                //         m(MenuItem, {
                                //             iconLeft: Icons.CLOUD_LIGHTNING,
                                //             label: 'Reset Data',
                                //             intent: 'negative',
                                //             onclick: () => {
                                //                 DATA = utils.generate_default();
                                //                 if (DATA_UPDATE_CB) { 
                                //                     DATA_UPDATE_CB()
                                //                 }
                                //             }
                                            
                                //         }),
                                //         ],
                                //         menuAttrs: { size: this.size },
                                //         trigger:  m(Icon, { name: Icons.SETTINGS })
                                //     })
                                // ])
                            ]),
                            m("", { style: {
                                "margin": "1em 1em 0 0",
                            }}, [
                                m(ToDos),
                            ]),
                        ]),
                        m(Col, {span: 3}, [
                            m(Card, {"style": "margin: 1em 0"}, [
                                m("h2", "Updates"),
                                m('ul', [
                                    m('li', 'Lorem ipsum dolor sit amet'),
                                    m('li', 'Consectetur adipiscing elit'),
                                    m('li', 'Faucibus porta lacus fringilla vel'),
                                    m('li', 'Eget porttitor lorem'),
                                ])
                            ]),
                            m(Card, {"style": "margin: 1em 0"}, [
                                m("h3", "Meetings"),
                                m('ul', [
                                    m('li', 'Lorem ipsum dolor sit amet'),
                                    m('li', 'Consectetur adipiscing elit'),
                                    m('li', 'Faucibus porta lacus fringilla vel'),
                                    m('li', 'Eget porttitor lorem'),
                                ])
                            ]),

                            m(Card, {}, [
                                m("h3", "References"),
                                m('ul', [
                                    m('li', 'Lorem ipsum dolor sit amet'),
                                    m('li', 'Consectetur adipiscing elit'),
                                    m('li', 'Faucibus porta lacus fringilla vel'),
                                    m('li', 'Eget porttitor lorem'),
                                ])
                            ])
                        ]),
                        m(utils.Toaster, {position: "bottom-end"})
                    ]
                )
            }
        };
    }

    return Dasbhboard;
    
});