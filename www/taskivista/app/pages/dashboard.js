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
        Icon,
        Grid,
        Card,
        Col,
        EmptyState,
        Classes,
    } = window.CUI;

    function Dasbhboard(vn) {

        let newToDo = utils.new_todo();
        let quick_edit_open = false;

        const ToDoList = {
            view: (vn) => {
                const {
                    USERS,
                    STATES,
                    onDataUpdate,
                    DATA,
                } = vn.attrs;
                const { todos } = DATA;

                let currentTodos = [];
                if (todos) {
                    for (let [id, todo] of Object.entries(todos)) {
                        currentTodos.push(
                            m(TodoItem, {todo, USERS, STATES, class: "boxed",
                                style: {
                                    "margin-top": "0.5em",
                                    "padding": "0.5em 1em",
                                },
                                onchanged: (updated) => {
                                    todos[updated.id] = updated;
                                    onDataUpdate(updated);
                                    utils.Toaster.show({
                                        message: `ToDo ${updated.title} updated`,
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
            view: (vn) => {
                const {
                    USERS,
                    STATES,
                } = vn.attrs;
                return m("", [
                    m(InlineToDoEdit, {
                        users: USERS,
                        todo: newToDo,
                        expanded: quick_edit_open,
                        onsubmit: (item) => {
                            ToDoModel.create(item);
                            newToDo = utils.new_todo();
                        },
                        onfocus: () => { quick_edit_open = true },
                        onclose: () => { quick_edit_open = false },
                        style: {
                            "padding": "0.5em 0",
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
                    m("", [m(ToDoList, vn.attrs)]),
                ]);
            }
        };

        const MeetingsCard = {
            view: (vn) => {
                const {
                    DATA
                } = vn.attrs;
                const {
                    meetings
                } = DATA;

                let current_meetings = []

                if (meetings) {
                    let ms = Object.values(meetings);
                    ms.sort((a, b) => {
                        if (a.due_date > b.due_date) {
                            return 1
                        } else if (a.due_date < b.due_date) {
                            return -1
                        }
                        return 0
                    })
                    current_meetings = ms.slice(0, 5)
                        .map(meeting => m("li", 
                            m(m.route.Link,
                                {href: `/meeting/${meeting.id}`, options: {replace: true}},
                                meeting.title
                            ))
                    );
                }

                return m(Card, {"style": "margin: 1em 0"}, [
                    m("h3", [
                        "Meetings",
                        m(m.route.Link,
                            {href: "/new_meeting", options: {replace: true}},
                            m(Icon, { name: Icons.PLUS_CIRCLE } )
                        ),
                    ]),
                    current_meetings.length > 0 ? m('ul', current_meetings) : ""
                    
                ]);
            }
        };


        return {
            view: (vn) => {
                return m(Grid, {
                    align: "top", justify: "space-between", gutter: "xs", class: "taskivista"
                    }, [
                        
                        m(Col, {span: 9}, [
                            m(`.boxed.${Classes.GRID}.${Classes.OUTLINED}.${Classes.ROUNDED}`, {style: {
                                "margin": "1em 1em 0 0"
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
                                m(ToDos, vn.attrs),
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
                            m(MeetingsCard, vn.attrs),

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