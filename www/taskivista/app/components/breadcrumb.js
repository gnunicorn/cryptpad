define([], function() {
    'use strict';
    const m = window.m;
    const {
        Breadcrumb,
        BreadcrumbItem,
        Icons,
        Icon,
        Grid,
        Col,
    } = window.CUI;

    return {
        view: (vnode) => {
            let items = [
                m(BreadcrumbItem, m(
                    m.route.Link, { href: "/", options: {replace: true} },
                        m(Icon, {size: "xs", name: Icons.HOME })
                    )
                )
            ];

            vnode.children.forEach(e => {
                items.push(
                    m(BreadcrumbItem, e)
                )
            });

            return m(".boxed.space-below.size-s",
                m(Grid, [
                    m(Breadcrumb, {
                        size: "xs",
                        seperator: m(Icon, { name: Icons.CHEVRON_RIGHT }),
                        style: "flex-grow: 1"
                    }, items),
                    m(m.route.Link, { href: "/settings", options: {replace: true} },
                        m(Icon, {size: "xs", name: Icons.SETTINGS })
                    )
                ]),
            );
        }
    }
    
});