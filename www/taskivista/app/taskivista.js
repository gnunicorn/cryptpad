define([
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/components/todo_item.js',
    '/taskivista/app/utils.js',
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
        PopoverMenu,
        MenuItem,
        MenuDivider,
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
    let DATA;
    let DATA_UPDATE_CB;

    let USERS = ["Ben", "Franka", "Milon"];
    let ASSIGNED = ["(not asssigned)"] + USERS;
    let SORT = ["Newest", "Oldest", "Recently updated"];
    let selectedStatus, selectedAssigned, selectedSort;


    var newToDo = utils.new_todo();

    const new_todo_submitter = (item) => {
        let todo_id = utils.generate_next_id(DATA.todos);
        item.id = todo_id;
        DATA.todos[todo_id] = item;
        if(DATA_UPDATE_CB) {
            DATA_UPDATE_CB();
        }
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
            if (DATA && DATA.todos) {
                for ([id, todo] of Object.entries(DATA.todos)) {
                    currentTodos.push(
                        m(TodoItem, {todo,
                            USERS: USERS,
                            STATES: DATA.SETTINGS.STATES,
                            style: {
                                "margin-top": "0.5em",
                                "padding": "0.5em 1em",
                                "background": BG_COLOR,
                                "border": BORDER,
                            },
                            onchanged: (updated) => {
                                console.log("saving", updated);
                                DATA.todos[updated.id] = updated;
                                if(DATA_UPDATE_CB) {
                                    DATA_UPDATE_CB();
                                }
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
            return m(ButtonGroup, { size: "sm" }, [
                m(CustomSelect, {
                    options: DATA.SETTINGS.STATES,
                    defaultValue: DATA.SETTINGS.STATES[0],
                    onSelect: item => (selectedStatus = item),
                    itemRender: item =>
                        m(ListItem, {
                            iconLeft: item.icon,
                            label: item.label || item.state,
                            selected: item === selectedStatus
                        }),
                    triggerAttrs: {
                        iconLeft: selectedStatus ? selectedStatus.icon : Icons.SQUARE,
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

    const Dashboard = {
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
                            m(Col, {span: 6, style: "text-align: right"}, [
                                m(PopoverMenu, {
                                    closeOnContentClick: true,
                                    content: [
                            
                                      m(MenuItem, {
                                        iconLeft: Icons.EDIT_2,
                                        label: 'Edit'
                                      }),
                            
                                      m(MenuItem, {
                                        iconLeft: Icons.SETTINGS,
                                        label: 'Settings'
                                      }),
                            
                                      m(MenuDivider),

                                      m(MenuItem, {
                                        iconLeft: Icons.CLOUD_LIGHTNING,
                                        label: 'Reset Data',
                                        intent: 'negative',
                                        onclick: () => {
                                            DATA = utils.generate_default();
                                            if (DATA_UPDATE_CB) { 
                                                DATA_UPDATE_CB()
                                            }
                                        }
                                        
                                      }),
                                    ],
                                    menuAttrs: { size: this.size },
                                    trigger:  m(Icon, { name: Icons.SETTINGS })
                                  })
                                ])
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

    const Root = {
        view: (vnode) => {
            let style = {};
            if (DATA && DATA.SETTING && DATA.SETTINGS.background_image) {
                style = {
                    "background": `url(${DATA.SETTINGS.background_image}) center center no-repeat`,
                    "background-size": "cover"
                }
            }
            return m("", { style }, vnode.children)
        }
    }

    return  {
        setData: (d) => {
            if (d.version) {
                console.log("Data incoming", d);
                DATA = d;
            } else {
                DATA = utils.generate_default();
                if(DATA_UPDATE_CB) {
                    DATA_UPDATE_CB();
                }
            }
            m.redraw();
        },
        getData: () => {
            return DATA
        },
        setRoutePrefix: (p) => {
            m.route.prefix = p;
        },
        onDataUpdate: (cb) => {
            DATA_UPDATE_CB = cb;
        },
        setDefaultData: () => {
            DATA = utils.generate_default();
        },
        initAt: (elem) => {
            m.route(elem, "/", {
                "/": { view: () => {return m(Root, m(Dashboard))} }
            });
        }
    }
});