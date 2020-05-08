define([
    '/taskivista/app/components/user_selector.js',
], function(
    UserSelector
) {
    'use strict';
    const m = window.m;
    const BG_COLOR = "#fff";

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
      } = window.CUI;

    return function EditTodo(initNode) {
        let todo = initNode.attrs.todo;
        return {
            view: (vnode) => {
                let expanded = vnode.attrs.expanded;
                let task_title = m(Input, {
                    placeholder: vnode.attrs.text || "Add a new task",
                    fluid: true,
                    basic: true,
                    size: expanded ? "xl" : "sm",
                    contentRight: expanded ? m(Icon, {
                        name: Icons.X,
                        onclick: vnode.attrs.onclose,
                    }) : m(Icon, {
                        name: Icons.PLUS,
                        onclick: vnode.attrs.onfocus,
                    }),
                    value: todo.title,
                    onkeyup: (e) => { 
                        if (e.key === "Escape") { vnode.attrs.onclose(); return }
                        todo.title = e.target.value;
                    },
                    onfocus: vnode.attrs.onfocus
                });

                if (!expanded) {
                    return m(Form, {
                        onsubmit: (evt) => {evt.preventDefault();}
                    }, [m(Col, {span: 4, style: vnode.attrs.style },
                        [task_title]
                    )])
                }

                return m(Form, {
                    onsubmit: vnode.attrs.onsubmit ? (evt) => {
                        evt.preventDefault();
                        vnode.attrs.onsubmit(todo, evt);
                    } : null,
                }, [m(Col, {span: 12, style: vnode.attrs.style },
                    [
                        task_title,
                        m("", {style: { "margin": "0.5em" }}, [
                            m(Input, {
                                contentLeft: m(Icon, {
                                    name: Icons.CALENDAR,
                                }),
                                onchange: (evt) => {
                                    todo.dueDate = evt.target.value;
                                },
                                size: "xs",
                                type: "date",
                                basic: true,
                                value: todo.dueDate
                            }),
                            m(Input, {
                                onchange: (evt) => {
                                    todo.dueTime = evt.target.value;
                                },
                                type: "time",
                                size: "xs",
                                basic: true,
                                value: todo.dueTime
                            }),

                            m(UserSelector, {
                                items: vnode.attrs.users,
                                sublabel: 'Assigned:',
                                value: todo.assigned,
                                onUpdate: (nv) => (todo.assigned = nv),
                            })
                        ]),
                        m(TextArea, {
                            onkeyup: (evt) => {
                                if (evt.key === "Escape") { vnode.attrs.onclose(); return }
                                todo.description = evt.target.value;
                            },
                            basic: true,
                            size: "sm",
                            fluid: true,
                            value: todo.description,
                        }),
                        m(Grid, {style: {"margin-top": "0.5em", "align-items": "center"}}, [
                            m(Col, {span: 4}, [
                                m(TagInput, {
                                    fluid: true,
                                    contentLeft: m(Icon, { name: Icons.TAG }),
                                    size: "sm",
                                    tags: todo.tags.map(tag => m(Tag, {
                                        label: tag,
                                        onRemove: () => {
                                            todo.tags.indexOf(tag);
                                            todo.tags.splice(index, 1);
                                        }
                                    })),
                                    onAdd: (item, evt) => {
                                        evt.preventDefault();
                                        todo.tags.push(item)
                                    }
                                }),
                            ]),
                            m(Col, {span: 4}, [
                                m(`h5.${Classes.TEXT_MUTED}`, "Linked to")
                            ]),
                            m(Col, {span: 4, style: { "text-align": "right" }}, [
                                m(Button, {
                                    size: "lg",
                                    type: "submit",
                                    outlined: true,
                                    intent: "primary",
                                    iconLeft: vnode.attrs.buttonIcon || Icons.SAVE,
                                    label: vnode.attrs.buttonLabel || "Save",
                                })
                            ])
                        ])
                    ])
                ]);
            }
        }
    };
});