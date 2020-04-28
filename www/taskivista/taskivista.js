define([], function () {
    var APP = window.APP = {};
    const m = window.m;
    const CUI = window.CUI;
    console.log(m, CUI);

    const {
        Button,
        Icons,
        CustomSelect,
        ButtonGroup,
        Drawer,
        Dialog,
        SelectList,
        ListItem,
        FocusManager
      } = CUI;

    let isDialogOpen = false;
    let isDrawerOpen = false;
    let selectedColor;

    const Taskivista = {
        view: () => {
            return m("[style=padding:30px]", [
            m(ButtonGroup, { size: "xs" }, [
                m(Button, {
                iconLeft: Icons.CALENDAR,
                label: "Open Dialog",
                onclick: () => (isDialogOpen = true)
                }),

                m(Button, {
                iconLeft: Icons.SETTINGS,
                label: "Open Drawer",
                onclick: () => (isDrawerOpen = true)
                }),

                m(SelectList, {
                items: ["Blue", "Purple", "Red", "Green"],
                itemRender: item =>
                    m(ListItem, {
                    label: item,
                    selected: item === selectedColor,
                    contentRight: m("", {
                        style: {
                        height: "10px",
                        width: "10px",
                        borderRadius: "50px",
                        background: item
                        }
                    })
                    }),
                itemPredicate: (query, item) =>
                    item.toLowerCase().includes(query.toLowerCase()),
                onSelect: item => (selectedColor = item),
                trigger: m(Button, {
                    iconLeft: Icons.DROPLET,
                    label: "Choose color",
                    iconRight: Icons.CHEVRON_DOWN
                })
                }),

                m(CustomSelect, {
                options: ["Jane", "John", "Janet"],
                defaultValue: "Jane",
                triggerAttrs: {
                    iconLeft: Icons.USERS
                }
                })
            ]),

            m(Dialog, {
                isOpen: isDialogOpen,
                onClose: () => (isDialogOpen = false),
                title: "Dialog",
                content: "Testing",
                footer: [
                m(Button, {
                    label: "Close",
                    onclick: () => (isDialogOpen = false)
                })
                ]
            }),

            m(Drawer, {
                isOpen: isDrawerOpen,
                content: "Content",
                position: "left",
                onClose: () => (isDrawerOpen = false)
            })
            ]);
        }
    };
    return Taskivista
});