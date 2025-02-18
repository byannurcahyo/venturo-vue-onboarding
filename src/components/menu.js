export const menuItems = [
    {
        id: 1,
        label: "Dashboard",
        icon: "bx-home-circle",
        link: "/",
    },
    {
        id: 2,
        label: "CRUD",
        icon: "bx-plus-circle",
        subItems: [
            {
                id: 5,
                label: "User",
                link: "/user",
                parentId: 2,
            },
            {
                id: 6,
                label: "Customer",
                link: "/customer",
                parentId: 2,
            },
            {
                id: 7,
                label: "Product Category",
                link: "/product-category",
                parentId: 2,
            },
            {
                id: 8,
                label: "Product",
                link: "/product",
                parentId: 2,
            },
        ],
    },
    {
        id: 3,
        label: "Transaksi",
        icon: "bx-wallet",
        link: "/transaksi",
    },
    {
        id: 4,
        label: "Report",
        icon: "bxs-report",
        subItems: [
            {
                id: 9,
                label: "Menu Sales Report",
                link: "/menu-sales-report",
                parentId: 4,
            },
            {
                id: 10,
                label: "Customer Sales Report",
                link: "/customer-sales-report",
                parentId: 4,
            },
        ],
    },
];
