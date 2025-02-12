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
            {
                id: 5,
                label: "Customer",
                link: "/customer",
                parentId: 3,
            },
            {
                id: 6,
                label: "Product Category",
                link: "/product-category",
                parentId: 3,
            },
            {
                id: 7,
                label: "Product",
                link: "/product",
                parentId: 3,
            },
        ],
    },
];
