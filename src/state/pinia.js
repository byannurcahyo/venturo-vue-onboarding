import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { useCustomerStore } from "./pinia/customer";
import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";
import { useSalesStore } from "./pinia/transaksi";
import { useCustomerReportStore } from "./pinia/customer-report";
import { useSalesReportStore } from "./pinia/sales-report";
import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export {
    useLayoutStore,
    useAuthStore,
    useUserStore,
    useCustomerStore,
    useProductCategoryStore,
    useProductStore,
    useSalesStore,
    useCustomerReportStore,
    useSalesReportStore,
};
