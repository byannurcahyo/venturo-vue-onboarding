export const menuItems = [
    {
        id: 1,
        label: "Dashboard",
        icon: "bx-home-circle",
        link: "/",
    },
    {
        id: 2,
        label: "Menu",
        isTitle: true,
    },
    {
        id: 3,
        label: "CRUD",
        icon: "bx-user-plus",
        subItems: [
            {
                id: 4,
                label: "User",
                link: "/user",
                parentId: 3,
            },
        ],
    },
];
