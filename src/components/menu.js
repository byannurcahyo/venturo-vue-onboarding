export const menuItems = [
    {
        id: 1,
        label: "Dashboard",
        icon: "bx-home-circle",
        subItems: [
            {
                id: 2,
                label: "Default",
                link: "/",
                parentId: 1,
            },
        ],
    },
    {
        id: 3,
        label: "Menu",
        isTitle: true,
    },
    {
        id: 4,
        label: "CRUD",
        icon: "bx-shield-alt-2",
        subItems: [
            {
                id: 5,
                label: "User",
                link: "/user",
                parentId: 4,
            },
        ],
    },
];
