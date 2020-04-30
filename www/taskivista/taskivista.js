define([], function () {
    const m = window.m;
    const CUI = window.CUI;

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }

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
    let STATUS = ["Open", "Finished", "Archived"];
    let USERS = ["Ben", "Franka", "Milon"];
    let ASSIGNED = ["(not asssigned)"] + USERS;
    let SORT = ["Newest", "Oldest", "Recently updated"];
    let selectedStatus, selectedAssigned, selectedSort;

    function generate_next(source) {
        let  uuid;
        do {
            uuid = uuidv4();
        } while (source[uuid]);
        return uuid;
    }

    const new_todo = () => {
        return {
            title: null,
            assigned: new Map(),
            dueDate: null,
            dueTime: null,
            tags: []
        }
    };

    var expanded = false;
    var newToDo = new_todo();

    const submitter = (evt) => {
        evt.preventDefault();
        let todo_id = generate_next(DATA.todos);
        newToDo.id = todo_id;
        DATA.todos[todo_id] = newToDo;
        newToDo = new_todo();
    };

    const InlineToDoAdder = {
        view: (vnode) => {
            let task_title = m(Input, {
                placeholder: vnode.attrs.text || "Add a new task",
                fluid: true,
                basic: true,
                size: expanded ? "xl" : "sm",
                contentRight: expanded ? m(Icon, {
                    name: Icons.X,
                    onclick: () => {
                        expanded = false
                    },
                }) : m(Icon, {
                    name: Icons.PLUS,
                    onclick: submitter,
                }),
                value: newToDo.title,
                onkeyup: (e) => { newToDo.title = e.target.value; },
                onfocus: () => { expanded = true }
            });

            if (!expanded) {
                return m(Form, {
                    onsubmit: submitter
                }, [m(Col, {span: 4, style: {
                    "background": BG_COLOR,
                    "padding": "0.5em",
                    }},
                    [task_title]
                )])
            }

            let currentlyAssigned = "(no one)";
            if (newToDo.assigned.size === 0) {

            }

            return m(Form, {
                onsubmit: submitter,
            }, [m(Col, {span: 12, style: {
                    "background": BG_COLOR,
                    "margin-bottom": "1em",
                    "padding": "0.5em",
                }},[
                    task_title,
                    m("", {style: { "margin": "0.5em" }}, [
                        m(Input, {
                            contentLeft: m(Icon, {
                                name: Icons.CALENDAR,
                            }),
                            onkeyup: (evt) => {
                                newToDo.dueDate = evt.target.value;
                            },
                            size: "xs",
                            type: "date",
                            basic: true,
                            value: newToDo.dueDate
                        }),
                        m(Input, {
                            onkeyup: (evt) => {
                                newToDo.dueTime = evt.target.value;
                            },
                            type: "time",
                            size: "xs",
                            basic: true,
                            value: newToDo.dueTime
                        }),

                        m(SelectList, {
                            items: USERS,
                            trigger: m(Button, {
                                align: 'left',
                                compact: true,
                                basic: true,
                                iconRight: Icons.CHEVRON_DOWN,
                                sublabel: 'Assigned:',
                                label: (newToDo.assigned.size === 0) ?
                                    "(no one)" : 
                                    Array.from(newToDo.assigned.keys()).join(", "),
                            }),
                            itemRender: item =>
                                m(ListItem, {
                                    label: item,
                                    selected: newToDo.assigned.has(item)
                                }),
                            itemPredicate: (query, item) =>
                                item.toLowerCase().includes(query.toLowerCase()),
                            onSelect: item => {
                                if (newToDo.assigned.has(item)) {
                                    newToDo.assigned.delete(item);
                                } else {
                                    newToDo.assigned.set(item, null)
                                }
                            }
                        })
                    ]),
                    m(TextArea, {
                        onkeyup: (evt) => {
                            newToDo.description = evt.target.value;
                        },
                        basic: true,
                        size: "sm",
                        fluid: true,
                        value: newToDo.description,
                    }),
                    m(TagInput, {
                        style: {
                            "margin": "1em 0 0 1em"
                        },
                        basic: true,
                        contentLeft: m(Icon, { name: Icons.TAG }),
                        size: "sm",
                        tags: newToDo.tags.map(tag => m(Tag, {
                            label: tag,
                            onRemove: () => {
                                newToDo.tags.indexOf(tag);
                                newToDo.tags.splice(index, 1);
                            }
                        })),
                        onAdd: (item) => newToDo.tags.push(item)
                    }),
                ])
            ]);
        }
    };

    const ToDoListItem = {
        view: (v) => {
            let todo = v.attrs.todo;
            return m(`.${Classes.ROUNDED}`, {
                key: todo.id,
                style: {
                    "margin-top": "0.5em",
                    "padding": "0.5em 1em",
                    "background": BG_COLOR,
                    "border": BORDER,
                    }
                }, [
                    m(".h4", todo.title)
            ])
        }

    }

    const ToDoList = {
        view: () => {
            let currentTodos = [];
            for ([id, todo] of Object.entries(DATA.todos)) {
                currentTodos.push(
                    m(ToDoListItem, {todo}),
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

    const ToDos = {
        view: () => {
            return m("", [
                m(InlineToDoAdder),
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