define([
    '/taskivista/app/components/user_selector.js',
    '/taskivista/app/utils.js',
], function(
    UserSelector,
    utils,
) {
    'use strict';
    const m = window.m;

    const {
        Button,
        Icons,
        Input,
        Col,
        Form,
        Icon,
        TagInput,
        Tag,
        TextArea,
        Classes,
      } = window.CUI;

    return function EditMeeting(initNode) {
        let meeting = initNode.attrs.meeting || utils.new_meeting();
        return {
            view: (vnode) => {
                return m(Form, {
                    onsubmit: vnode.attrs.onsubmit ? (evt) => {
                        evt.preventDefault();
                        vnode.attrs.onsubmit(meeting, evt);
                    } : null,
                    style: vnode.attrs.style,
                }, [
                  m(Col, {span: 12 },
                    [
                        m(Input, {
                            placeholder: "Name the meeting",
                            fluid: true,
                            basic: true,
                            size: "xl" ,
                            value: meeting.title,
                            onkeyup: (e) => {
                                meeting.title = e.target.value;
                            },
                            onfocus: vnode.attrs.onfocus
                        }),
                    ]),
                  m(Col, {span: 3 },
                    [
                        m(Input, {
                            contentLeft: m(Icon, {
                                name: Icons.CALENDAR,
                            }),
                            onchange: (evt) => {
                                meeting.whenDate = evt.target.value;
                            },
                            size: "ml",
                            type: "date",
                            basic: true,
                            value: meeting.whenDate
                        }),
                        m(Input, {
                            onchange: (evt) => {
                                meeting.whenTime = evt.target.value;
                            },
                            type: "time",
                            size: "ml",
                            basic: true,
                            value: meeting.whenTime
                        }),
                    ]),
                    m(Col, { span: 7 }, [
                        m(UserSelector, {
                            sublabel: "Invitees:",
                            items: vnode.attrs.USERS
                        })
                    ]),
                    m(Col, { span: 8, style: { "margin-top": "0.5em" } }, [
                        m(`h5.${Classes.TEXT_MUTED}`, "Agenda"),
                        m(TextArea, {
                            onkeyup: (evt) => {
                                meeting.agenda = evt.target.value;
                            },
                            basic: true,
                            size: "ml",
                            fluid: true,
                            value: meeting.agenda,
                        }),
                    ]),
                    m(Col, {span: 4, style: { "margin-top": "0.5em" } }, [
                        m(`h5.${Classes.TEXT_MUTED}`, "Linked to")
                    ]),
                    m(Col, {span: 8, style: { "margin-top": "0.5em" }}, [
                        m(TagInput, {
                            fluid: true,
                            contentLeft: m(Icon, { name: Icons.TAG }),
                            size: "ml",
                            tags: meeting.tags.map(tag => m(Tag, {
                                label: tag,
                                onRemove: () => {
                                    meeting.tags.indexOf(tag);
                                    meeting.tags.splice(index, 1);
                                }
                            })),
                            onAdd: (item, evt) => {
                                evt.preventDefault();
                                meeting.tags.push(item)
                            }
                        })
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
                ]);
            }
        }
    };
});