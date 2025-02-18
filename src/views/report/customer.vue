<template>
    <Layouts>
        <PageHeader title="Customer Sales Report" pageTitle="Report" />
        <BCard>
            <BTableSimple>
                <BThead>
                    <BTr>
                        <BTh>No</BTh>
                        <BTh>Customer</BTh>
                        <BTh>Date</BTh>
                        <BTh>Menu</BTh>
                        <BTh>Total Item</BTh>
                        <BTh>Price</BTh>
                        <BTh>Total Price</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-if="rows.length === 0" class="my-3">
                        <BTd colspan="7" class="text-center"
                            >There is no data</BTd
                        >
                    </BTr>
                    <BTr v-for="(sale, index) in rows" :key="sale.id">
                        <BTd>{{ index + 1 }}</BTd>
                        <BTd>{{ sale.customer }}</BTd>
                        <BTd>{{ sale.tanggal }}</BTd>
                        <BTd>{{ sale.menu }}</BTd>
                        <BTd>{{ sale.quantity }}</BTd>
                        <BTd>{{ sale.price }}</BTd>
                        <BTd>{{ sale.total }}</BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
            <Pagination
                :currentPage="saleStore.current"
                :totalRows="rowLength"
                :perPage="saleStore.perPage"
                @update:currentPage="updatePage"
            />
        </BCard>
    </Layouts>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import {
    useCustomerStore,
    useProductStore,
    useCustomerReportStore,
} from "@/state/pinia";
import { useProgress } from "@/helpers/progress";
import PageHeader from "../../components/page-header.vue";
import Pagination from "../../components/widgets/pagination.vue";
import Layouts from "../../layouts/main.vue";

const { startProgress, finishProgress, failProgress } = useProgress();
const saleStore = useCustomerReportStore();
const productStore = useProductStore();
const customerStore = useCustomerStore();
const rowLength = computed(() => rows.value.length);
const rows = ref([]);
const customers = ref([]);
const menus = ref([]);

const getSales = async () => {
    startProgress();
    await saleStore.getSales();
    if (saleStore.sales) {
        finishProgress();
        rows.value = saleStore.sales.reduce((acc, sale) => {
            const { m_customer_name: customer, date: tanggal, details } = sale;
            const saleRows = details.map((detail) => ({
                id: detail.id,
                customer,
                tanggal,
                menu: detail.product,
                quantity: detail.total_item,
                price: parseFloat(detail.price).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }),
                total: parseFloat(
                    detail.price * detail.total_item
                ).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }),
            }));
            return acc.concat(saleRows);
        }, []);
    } else {
        failProgress();
        menus.value = [];
    }
};

const getCustomers = async () => {
    startProgress();
    await customerStore.getCustomers();
    if (customerStore.customers) {
        finishProgress();
        customers.value =
            customerStore.customers.map((customer) => ({
                name: customer.name,
                id: customer.id,
            })) || [];
    } else {
        failProgress();
        customers.value = [];
    }
};

const getProducts = async () => {
    startProgress();
    await productStore.getProducts();
    if (productStore.products) {
        finishProgress();
        menus.value =
            productStore.products.map((product) => ({
                name: product.name,
                id: product.id,
            })) || [];
    } else {
        failProgress();
        menus.value = [];
    }
};

const updatePage = async (page) => {
    saleStore.current = page;
    await getSales();
};

onMounted(async () => {
    await getSales();
    await getCustomers();
    await getProducts();
});
</script>
