define([
    '/taskivista/app/components/edit_meeting_details.js',
], function(
    EditMeetingDetails
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


    function EditPage(vinit) {
        return {
            view: () => {

            }
        }
    }

    function ScheduleNew(vn) {

        const {
            USERS,
            onUpdated,
            BG_COLOR,
            BORDER
        } = vn.attrs;

        return {
            view: (vnode) => {
                return m("", {
                    class: "taskivista",
                    style: {
                        "margin-top": "1em",
                        "padding": "1em",
                        "background": BG_COLOR,
                        "border": BORDER,
                    }}, [
                        m(EditMeetingDetails, {
                            USERS, onUpdated
                        })
                    ]
                )
            }
        }
    }

    return {
        EditPage,
        ScheduleNew,
    }
})