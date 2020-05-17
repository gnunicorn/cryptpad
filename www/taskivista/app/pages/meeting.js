define([
    '/taskivista/app/components/edit_meeting_details.js',
    '/taskivista/app/components/inline_todo_edit.js',
    '/taskivista/app/components/todo_item.js',
    '/taskivista/app/models/todo.js',
    '/taskivista/app/models/note.js',
    '/taskivista/app/models/global.js',
    '/taskivista/app/utils.js',

], function(
    EditMeetingDetails,
    InlineToDoEdit,
    ToDoItem,
    ToDoModel,
    NotesModel,
    global,
    utils,
) {
    'use strict';
    const m = window.m;
    const {
        Icons,
        Grid,
        Icon,
        Tag,
        Col,
        Classes,
        Button,
        ButtonGroup,
        TextArea,
    } = window.CUI;

    const {
        getState,
    } = global;
    

    const ViewNote = {
        view: (vn) => m("", [
            vn.attrs.note.type == "decision" ? m(Icon, {
                name: Icons.FLAG, itent: "warning"
            }) : m(Icon, {
                name: Icons.FILE
            }),
            m("", vn.attrs.note.content)
        ])
    }

    const EditNote = (vn) => {
        let note = vn.attrs.note;
        return {
            view: (vn) => m("", {class: Classes.GRID}, [
                m("",
                    note.type == "decision" ? m(Icon, {
                        name: Icons.FLAG, itent: "warning"
                    }) : m(Icon, {
                        name: Icons.FILE
                    })
                ),
                m("", {style: {"flex-grow": "1"}},
                    m(TextArea, {
                        width: "100%",
                        basic: true,
                        value: note.content,
                        onchange: (e) => {
                            note.content = e.target.value;
                        }
                    })
                ),
                m(ButtonGroup, {
                    basic: true
                }, [
                    m(Button, {
                        iconLeft: Icons.X,
                        onclick: vn.attrs.oncancel
                    }),
                    m(Button, {
                        label: "Save",
                        intent: "primary",
                        onclick: () => {
                            vn.attrs.onsubmit(note);
                        }
                    })
                ])
            ])
        }
    }


    function ViewMeeting(vinit) {
        let edit_details = false;
        let pending_outcomes = [];
        return {
            view: (vnode) => {
                const {
                    id,
                } = vnode.attrs;
                const {
                    DATA,
                    USERS,
                    onDataUpdate,
                } = getState();
                const meeting = DATA.meetings[id];


                let details = [];
                if (meeting.whenDate) {
                    let dayDiff = utils.diff_date(meeting.whenDate);
                    let formatted = utils.formate_day_diff(dayDiff);
                    if (dayDiff === 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.POSITIVE}`,[
                            m(Icon, {name: Icons.CLOCK}),
                            m("span", ` ${formatted} ${meeting.whenTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff < 0) {
                        details.push(m(`span.${Classes.CUI_CONTROL}.${Classes.WARNING}`,[
                            m(Icon, {name: Icons.ALERT_CIRCLE}),
                            m(`span`,
                                ` ${formatted} ${meeting.whenTime||""}`
                            )
                        ]
                        ));
                    } else if (dayDiff > 0) {
                        details.push(m(`span.${Classes.TEXT_MUTED}`,  
                            `${formatted} ${meeting.whenTime||""}`
                        ));
                    }
                }
                if (Array.isArray(meeting.participants) && meeting.participants.length > 0) {
                    details.push(m("span", [
                        m(Icon, {name: Icons.USERS}),
                        m("span", [utils.render_users(meeting.participants, USERS)]),
                    ]))
                }
                if (Array.isArray(meeting.tags) && meeting.tags.length > 0) {
                    details.push(m("", meeting.tags.map((tag) => 
                        details.push(m(Tag, {label: tag, size: "sm"})))));
                }

                let outcomes = [];
                if (Array.isArray(meeting.outcomes) && meeting.outcomes.length > 0) {
                    outcomes = meeting.outcomes.map((a) => {
                        if (a.type == "todo") {
                            return m(ToDoItem, {
                                USERS,
                                todo: DATA.todos[a.todo_id],
                            })
                        } else if (a.type == "note" || a.type == "decision") {
                            return m(ViewNote, {
                                note: DATA.notes[a.note_id],
                            })
                        }
                    })
                }

                let pending = pending_outcomes.map((o, idx) => {
                    if (o.type == "todo") {
                        return m(InlineToDoEdit, {
                            users: USERS,
                            todo: o.todo,
                            expanded: true,
                            onsubmit: (item) => {
                                let todo = ToDoModel.create(item, {meeting_id: meeting.id});
                                meeting.outcomes.push({
                                    type: "todo",
                                    todo_id: todo.id
                                });
                                pending_outcomes.splice(idx, 1);
                            },
                            onclose: () => {
                                pending_outcomes.splice(idx, 1);
                            }
                        })
                    } else if (o.type == "note" || o.type == "decision") {
                        return m(EditNote, {
                            note: o,
                            onsubmit: (v) => {
                                let note = NotesModel.create(v);
                                meeting.outcomes.push({
                                    type: note.type,
                                    note_id: note.id
                                });
                                pending_outcomes.splice(idx, 1);
                            },
                            oncancel: () => {
                                pending_outcomes.splice(idx, 1);
                            }
                        })
                    }
                })


                return m("", { class: "taskivista", style: { "margin-top": "1em" }}, [
                    edit_details ? m(".boxed",
                        m(EditMeetingDetails, {
                            meeting,
                            USERS,
                            onsubmit: (item) => {
                                DATA.meetings[id] = item;
                                onDataUpdate();
                                edit_details = false;
                            },
                            buttonLabel: "Save"
                        }))
                    : m(Grid, { class : "boxed" }, [
                            m(Col, {span:11}, [
                                m("h2", meeting.title),
                                m("", details)
                            ]),
                            m(Col, {span: 1, style: { "text-align": "right"}},
                                m(Icon, {name: Icons.EDIT, onclick:() => (edit_details = true)})),
                            m(Col, { span: 12 }, [
                                m("h3", "Agenda"),
                                m("", meeting.agenda), 
                            ])
                        ])
                    ,
                    m(".boxed", { style: "margin-top: 1em"}, [
                        m("h2", "Outcomes"),
                        m("", outcomes),
                        m("", pending),
                        m(ButtonGroup, {
                            basic: true,
                        }, [
                            m(Button, {
                                iconLeft: Icons.CHECK_SQUARE,
                                label: "ToDo",
                                onclick: () => {
                                    pending_outcomes.push({
                                        type: "todo", todo: utils.new_todo()
                                    });
                                }
                            }),
                            m(Button, {
                                iconLeft: Icons.FLAG,
                                label: "Decision",
                                onclick: () => {
                                    pending_outcomes.push({
                                        type: "decision", content: ""
                                    });
                                }
                            }),
                            m(Button, {
                                iconLeft: Icons.FILE,
                                label: "Note",
                                onclick: () => {
                                    pending_outcomes.push({
                                        type: "note", content: ""
                                    });
                                }
                            })
                        ]),
                    ]),
                ]);
            }
        }
    }

    function ScheduleNew(vn) {
        return {
            view: (vnode) => {
                const {
                    USERS,
                    onDataUpdate,
                    DATA,
                } = vn.attrs;

                return m(".taskivista.boxed", {
                    style: {
                        "margin-top": "1em",
                    }}, [
                        m(EditMeetingDetails, {
                            USERS,
                            onsubmit: (item) => {
                                console.log("new item", DATA);
                                if (!DATA.meetings) {
                                     DATA.meetings = {};
                                }
                                let id = item.id = utils.generate_next_id(DATA.meetings);
                                DATA.meetings[id] = item;
                                onDataUpdate();
                                m.route.set('/meeting/:id', { id });
                            },
                            buttonLabel: "Create"
                        })
                    ]
                )
            }
        }
    }

    return {
        ViewMeeting,
        ScheduleNew,
    }
})