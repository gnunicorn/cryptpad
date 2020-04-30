define([
    '/taskivista/components/inline_todo_edit.js',
    '/taskivista/components/todo_item.js',
    '/taskivista/utils.js',
], function (
    InlineToDoEdit,
    TodoItem,
    utils,
) {
    const m = window.m;
    const CUI = window.CUI;


    const BG_COLOR = "#fff";
    const BORDER = "solid 1px #c5cdd1";
      

    const {
        Button,
        Icons,
        CustomSelect,
        ButtonGroup,
        Drawer,
        Input,
        Dialog,
        SelectList,
        ListItem,
        Grid,
        Card,
        Col,
        EmptyState,
        Classes,
        Form,
        Icon,
        TagInput,
        Tag,
        TextArea,
      } = CUI;

    let isDialogOpen = false;
    let isDrawerOpen = false;
    let DATA = {
        todos: {
            "12-12-12": {
                "title": "Whatelse"
            }
        }
    };
    let STATUS = ["open", "progress", "done", "archived"];
    let USERS = ["Ben", "Franka", "Milon"];
    let ASSIGNED = ["(not asssigned)"] + USERS;
    let SORT = ["Newest", "Oldest", "Recently updated"];
    let selectedStatus, selectedAssigned, selectedSort;


    var newToDo = utils.new_todo();

    const new_todo_submitter = (item) => {
        let todo_id = utils.generate_next_id(DATA.todos);
        item.id = todo_id;
        DATA.todos[todo_id] = item;
        newToDo = utils.new_todo();
    };

    const ToDoList = {
        view: () => {
            let currentTodos = [];
            for ([id, todo] of Object.entries(DATA.todos)) {
                currentTodos.push(
                    m(TodoItem, {todo, style: {
                        "margin-top": "0.5em",
                        "padding": "0.5em 1em",
                        "background": BG_COLOR,
                        "border": BORDER,
                        }
                    }),
                );
            };

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
                        content: m(InlineToDoAdder, { size: "md", text: "or add a new task" })
                    })
                ]);
            }
            
            return m("", {style: { "margin-top": "1em" } }, [
                m("", currentTodos),
            ]); 
        }
    }

    var quick_edit_open = false;

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
                m("", {style: "text-align: right"}, [m(FilterAndSort)] ),
                m("", [m(ToDoList)]),
            ]);
        }
    };

    const FilterAndSort = {
        view: () => {
            return m(ButtonGroup, { size: "xs" }, [
                m(CustomSelect, {
                    options: STATUS,
                    defaultValue: "Open",
                    onSelect: item => (selectedStatus = item),
                    triggerAttrs: {
                        iconLeft: Icons.SQUARE,
                        iconRight: Icons.CHEVRON_DOWN
                    }
                }),
                m(SelectList, {
                    items: ASSIGNED,
                    itemRender: item =>
                        m(ListItem, {
                            label: item,
                            selected: item === selectedAssigned
                        }),
                    itemPredicate: (query, item) =>
                        item.toLowerCase().includes(query.toLowerCase()),
                    onSelect: item => (selectedAssigned = item),
                    trigger: m(Button, {
                        iconLeft: Icons.USERS,
                        label: ASSIGNED[selectedAssigned] || "Assigned",
                        iconRight: Icons.CHEVRON_DOWN
                    })
                }),
                m(CustomSelect, {
                    options: SORT,
                    defaultValue: "Newest",
                    onSelect: item => (selectedStatus = item),
                    triggerAttrs: {
                        iconLeft: Icons.CHEVRONS_DOWN,
                        iconRight: Icons.CHEVRON_DOWN
                    }
                }),
            ])
        }
    };

    console.log(Classes);

    const Dashboard = {
        view: () => {
            return m(Grid, {align: "top", justify: "space-between", gutter: "xs",
                    style: {
                        margin: "1em auto",
                        "max-width": "1280px",
                    },
                }, [
                    
                    m(Col, {span: 9}, [
                        m(`.${Classes.GRID}.${Classes.OUTLINED}.${Classes.ROUNDED}`, {style: {
                            "margin": "1em 1em 0 0",
                            "padding": "1em",
                            "background": BG_COLOR,
                            "border": BORDER,
                        }}, [
                            m(Col, {span: 6}, [m("h1", "Taskivista")]),
                            m(Col, {span: 6, style: "text-align: right"}, [
                                    m(Icon, { name: Icons.SETTINGS }),
                            ]),
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
                    ])
                ]
            )
        }
    };

    return Dashboard;

    // const Taskivista = {
    //     view: () => {
    //         return m("[style=padding:30px]", [
    //         m(ButtonGroup, { size: "xs" }, [
    //             m(Button, {Newest
    //             iconLeft: Icons.CALENDAR,
    //             label: "Open Dialog",
    //             onclick: () => (isDialogOpen = true)
    //             }),

    //             m(Button, {
    //             iconLeft: Icons.SETTINGS,
    //             label: "Open Drawer",
    //             onclick: () => (isDrawerOpen = true)
    //             }),

    //             m(SelectList, {
    //             items: ["Blue", "Purple", "Red", "Green"],
    //             itemRender: item =>
    //                 m(ListItem, {
    //                 label: item,
    //                 selected: item === selectedColor,
    //                 contentRight: m("", {
    //                     style: {
    //                     height: "10px",
    //                     width: "10px",
    //                     borderRadius: "50px",
    //                     background: item
    //                     }
    //                 })
    //                 }),
    //             itemPredicate: (query, item) =>
    //                 item.toLowerCase().includes(query.toLowerCase()),
    //             onSelect: item => (selectedColor = item),
    //             trigger: m(Button, {
    //                 iconLeft: Icons.DROPLET,
    //                 label: "Choose color",
    //                 iconRight: Icons.CHEVRON_DOWN
    //             })
    //             }),

    //             m(CustomSelect, {
    //             options: ["Jane", "John", "Janet"],
    //             defaultValue: "Jane",
    //             triggerAttrs: {
    //                 iconLeft: Icons.USERS
    //             }
    //             })
    //         ]),

    //         m(Dialog, {
    //             isOpen: isDialogOpen,
    //             onClose: () => (isDialogOpen = false),
    //             title: "Dialog",
    //             content: "Testing",
    //             footer: [
    //             m(Button, {
    //                 label: "Close",
    //                 onclick: () => (isDialogOpen = false)
    //             })
    //             ]
    //         }),

    //         m(Drawer, {
    //             isOpen: isDrawerOpen,
    //             content: "Content",
    //             position: "left",
    //             onClose: () => (isDrawerOpen = false)
    //         })
    //         ]);
    //     }
    // };
    // return Taskivista
});